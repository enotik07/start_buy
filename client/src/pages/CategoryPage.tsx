import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid2,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetCategoryQuery,
  useGetRecommendsProductsQuery,
} from "../store/services/storeAPI";
import Loading from "../components/common/Loading";
import { BASE_URL } from "../helpers/config";
import { useState } from "react";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import ProductCard from "../components/products/ProductCard";

const products_count = 20;
export default function CategoryPage() {
  const { id } = useParams();
  const {
    data: category,
    isFetching: categoryLoading,
    error: categoryError,
    refetch: categoryRefetch,
  } = useGetCategoryQuery(Number(id));
  const [page, setPage] = useState(1);
  const {
    data: products,
    isFetching: productsLoading,
    error: productsError,
    refetch: productsRefetch,
  } = useGetRecommendsProductsQuery({
    page,
    page_size: products_count,
    categories: [Number(id)],
  });

  const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Loading
        loading={categoryLoading}
        error={categoryError}
        refetch={categoryRefetch}
        skeleton={
          <>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton variant="rounded" width="40px" height="40px" />
              <Typography variant="h6" width="200px">
                <Skeleton />
              </Typography>
            </Box>
            <Typography variant="subtitle1">
              <Skeleton />
            </Typography>
          </>
        }
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            variant="rounded"
            src={
              category?.icon.includes("http")
                ? category?.icon
                : BASE_URL + category?.icon
            }
          />
          <Typography variant="h6">{category?.name}</Typography>
        </Box>
        <Typography
          variant="subtitle1"
          textAlign="justify"
          color="textSecondary"
        >
          {category?.description}
        </Typography>
      </Loading>
      <Divider sx={{ marginInline: 2, marginBlock: 4 }} />
      <Grid2 container spacing={3}>
        <Loading
          loading={productsLoading}
          error={productsError}
          refetch={productsRefetch}
          skeleton={Array.from({ length: products_count }).map((_, index) => (
            <Grid2 size={{ xs: 6, sm: 2.4 }} key={index}>
              <ProductCardSkeleton />
            </Grid2>
          ))}
        >
          {products?.results.map((product) => (
            <Grid2 size={{ xs: 6, sm: 2.4 }} key={product.id}>
              <ProductCard product={product} />
            </Grid2>
          ))}
          {products && products.pages > 1 && (
            <Pagination            
              count={products.pages}
              variant="outlined"
              color="primary"
              page={page}
              onChange={pageChange}
              size="large"
              sx={{
                width: '100%',
                paddingTop: 1,
                display: "flex",
                justifyContent: "center",
              }}
            />
          )}
        </Loading>
      </Grid2>
    </Container>
  );
}
