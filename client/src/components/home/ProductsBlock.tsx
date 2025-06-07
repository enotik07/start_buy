import { useState } from "react";
import { useGetRecommendsProductsQuery } from "../../store/services/storeAPI";
import BlockHeader from "./BlockHeader";
import { Box, Button, Grid2 } from "@mui/material";
import Loading from "../common/Loading";
import ProductCardSkeleton from "../products/ProductCardSkeleton";
import ProductCard from "../products/ProductCard";

const products_count = 10;

export default function ProductBlock() {
  const [page, setPage] = useState<number>(1);
  const { data, isFetching, error, refetch } = useGetRecommendsProductsQuery({
    page,
    page_size: products_count,
  });
  return (
    <>
      <BlockHeader
        label="Our Products"
        title="Explore Our Products"
        pagination={true}
        page={page}
        pages={data?.pages}
        previousClick={() => setPage(page - 1)}
        nextClick={() => setPage(page + 1)}
      />
      <Grid2 container spacing={3}>
        <Loading
          loading={isFetching}
          error={error}
          refetch={refetch}
          skeleton={Array.from({ length: products_count }).map((_, index) => (
            <Grid2 size={{ xs: 6, sm: 2.4 }} key={index}>
              <ProductCardSkeleton />
            </Grid2>
          ))}
        >
          {data?.results.map((product) => (
            <Grid2 size={{ xs: 6, sm: 2.4 }} key={product.id}>
              <ProductCard product={product} />
            </Grid2>
          ))}
        </Loading>
      </Grid2>
      <Box display="flex" justifyContent="center">
        <Button variant="contained" href="/products">
          View all Products
        </Button>
      </Box>
    </>
  );
}
