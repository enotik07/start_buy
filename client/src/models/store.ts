import { IPaginationParams } from "./pagination";

export interface IFilter extends IPaginationParams {
  query: string;
}

export interface ICategoryName {
  id: number;
  name: string;
}

export interface ICategoryCard extends ICategoryName {
  icon: string;
}

export interface ICategory extends ICategoryCard {
  description: string;
  products: number;
  time_since_created: string;
}


export interface IAddCategory {
  name: string;
  description: string;
  image_url?: string;
  image?: File;
}

export interface IUpdateCategory extends IAddCategory {
  id: number;
}

export interface IProductCard {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  categories: number[];
  images: string[];
  time_since_created: string;
}

export interface IProductParams {
  id: number,
  source?: string | null,
  query?: string | null,
}

export interface IAddProduct {
  name: string;
  description: string;
  price: number;
  category_ids: number[];
  images: File[];
}

export interface IUpdateProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category_ids: number[];
  images: File[];
  existing_images: string[];
}

export interface IStatistic {
  title: string;
  count: string;
  change: string;
}

export enum SortEnum {
  popularity  = 'popularity',
  newest = 'newest',
  priceLowToHigh = 'priceLowToHigh',
  priceHightToLow = 'priceHightToLow',
}

export interface IProductFilter extends IPaginationParams {
  categories?: number[],
  price_min?: number,
  price_max?: number,
  sort?: SortEnum,
  query?: string,
}

export interface IAddCartItem {
  product: number,
  quantity: number,
}

export interface ICartItem {
  id: number,
  product: IProductCard,
  quantity: number,
}

export interface IRelatedParams extends IPaginationParams {
  product: number
}

export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  dob: string;
}