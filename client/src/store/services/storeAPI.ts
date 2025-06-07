import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../helpers/config";
import { deleteTokens, getTokens, saveTokens } from "../../utils/authCookies";
import { IAuthResponse } from "../../models/auth";
import {
  IAddCartItem,
  IAddCategory,
  IAddProduct,
  ICartItem,
  ICategory,
  ICategoryCard,
  ICategoryName,
  IFilter,
  IProduct,
  IProductCard,
  IProductFilter,
  IProductParams,
  IRelatedParams,
  IStatistic,
  IUpdateCategory,
  IUpdateProduct,
  IUser,
} from "../../models/store";
import { IPagination, IPaginationParams } from "../../models/pagination";

async function prepareHeaders(headers: Headers): Promise<Headers> {
  let { accessToken, refreshToken } = getTokens();

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(BASE_URL + "auth/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (response.ok) {
        const auth: IAuthResponse = await response.json();
        saveTokens(auth);
        accessToken = auth.access_token;
      } else {
        deleteTokens();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      deleteTokens();
      window.location.href = "/";
    }
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

const storeAPI = createApi({
  reducerPath: "storeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["Category", "Product", "Cart", 'User'],
  endpoints: (build) => ({
    //categories
    getCategories: build.query<IPagination<ICategory>, IFilter>({
      query: ({ page, page_size, query }) => ({
        url: `categories?page_size=${page_size}&page=${page}&query=${query}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    addCategory: build.mutation<void, IAddCategory>({
      query: (category) => {
        const formData = new FormData();
        formData.append("name", category.name);
        formData.append("description", category.description);
        if (category.image) formData.append("image", category.image);
        if (category.image_url)
          formData.append("image_url", category.image_url);

        return {
          url: "categories",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    updateCategory: build.mutation<void, IUpdateCategory>({
      query: (category) => {
        const formData = new FormData();
        formData.append("name", category.name);
        formData.append("description", category.description);
        if (category.image) formData.append("image", category.image);
        if (category.image_url)
          formData.append("image_url", category.image_url);

        return {
          url: `categories?id=${category.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    deleteCategory: build.mutation<void, number>({
      query: (id) => ({
        url: `categories?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    getCategory: build.query<ICategory, number>({
      query: (id) => ({
        url: `category/${id}/`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getPopularCategories: build.query<
      IPagination<ICategoryCard>,
      IPaginationParams
    >({
      query: ({ page, page_size }) => ({
        url: `popular-categories?page_size=${page_size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoriesNames: build.query<ICategoryName[], void>({
      query: () => ({
        url: `categories/names`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    //images
    getBase64Image: build.mutation<{ mime_type: string; data: string }, string>(
      {
        query: (url) => ({
          url: `image-decode`,
          method: "POST",
          body: {
            url: url,
          },
        }),
      }
    ),

    //products
    getProducts: build.query<IPagination<IProduct>, IFilter>({
      query: ({ page, page_size, query }) => ({
        url: `products?page_size=${page_size}&page=${page}&query=${query}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    addProduct: build.mutation<void, IAddProduct>({
      query: (product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price.toString());
        for (const image of product.images)
          formData.append("images_data", image);
        for (const category of product.category_ids)
          formData.append("category_ids", category.toString());
        return {
          url: "products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: build.mutation<void, IUpdateProduct>({
      query: (product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price.toString());
        for (const image of product.images)
          formData.append("images_data", image);
        for (const existing_image of product.existing_images)
          formData.append("existing_images", existing_image);
        for (const category of product.category_ids)
          formData.append("category_ids", category.toString());

        return {
          url: `products?id=${product.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<void, number>({
      query: (id) => ({
        url: `products?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getProduct: build.query<IProduct, IProductParams>({
      query: ({ id, query, source }) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (source) params.set("source", source);
        return {
          url: `product/${id}/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),
    getRecommendsProducts: build.query<
      IPagination<IProductCard>,
      IProductFilter
    >({
      query: ({
        page,
        page_size,
        categories,
        price_min,
        price_max,
        sort,
        query,
      }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("page_size", page_size.toString());

        categories?.forEach((cat) =>
          params.append("categories", cat.toString())
        );
        if (price_min) params.append("price_min", price_min.toString());
        if (price_max) params.append("price_max", price_max.toString());
        if (sort) params.append("sort", sort.toString());
        if (query) params.append("query", query);
        return {
          url: `recommendation/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),
    getRelatedProducts: build.query<IPagination<IProductCard>, IRelatedParams>({
      query: ({ page, page_size, product }) => ({
        url: `similar/${product}/?page_size=${page_size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    //statistics
    getStatistics: build.query<IStatistic[], void>({
      query: () => ({
        url: `statistics`,
        method: "GET",
      }),
      providesTags: ["Product", "Category"],
    }),

    //cart
    addCartItem: build.mutation<void, IAddCartItem>({
      query: (cartItem) => ({
        url: "cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),
    getCart: build.query<IPagination<ICartItem>, IPaginationParams>({
      query: ({ page, page_size }) => ({
        url: `cart?page_size=${page_size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    deleteCartItem: build.mutation<void, number>({
      query: (id) => ({
        url: `cart?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    //user
    getUser: build.query<IUser, void>({
      query: () => ({
        url: `auth/user-info/`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export default storeAPI;
export const {
  //category
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoriesNamesQuery,
  useDeleteCategoryMutation,
  useGetPopularCategoriesQuery,
  //images
  useGetBase64ImageMutation,
  //products
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useGetRecommendsProductsQuery,
  useGetRelatedProductsQuery,
  //statistics
  useGetStatisticsQuery,
  //cart
  useAddCartItemMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
  //user
  useGetUserQuery,
} = storeAPI;
