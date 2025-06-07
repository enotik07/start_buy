import { useParams, useSearchParams } from "react-router-dom";
import {
  useAddCartItemMutation,
  useGetProductQuery,
  useGetRelatedProductsQuery,
} from "../store/services/storeAPI";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid2,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { BASE_URL } from "../helpers/config";
import { ShoppingCartOutlined as CartIcon } from "@mui/icons-material";
import BlockHeader from "../components/home/BlockHeader";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import ProductCard from "../components/products/ProductCard";
import QuantityField from "../components/products/QuantityField";

const products_count = 5;

export default function ProductPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [id]);
  const { data, isFetching, error, refetch } = useGetProductQuery({
    id: Number(id),
    query: searchParams.get("query"),
    source: searchParams.get("source"),
  });
  const [addToCart, { isLoading }] = useAddCartItemMutation();
  const {
    data: products,
    isFetching: productsLoading,
    error: productsError,
    refetch: productsRefetch,
  } = useGetRelatedProductsQuery({
    page,
    page_size: products_count,
    product: Number(id),
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid2 container spacing={4} mb={4}>
        <Loading loading={isFetching} error={error} refetch={refetch}>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", gap: 2, flexDirection: "row" }}
          >
            <Stack direction="column" spacing={1}>
              {data?.images.map((img, idx) => (
                <Card
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 120,
                    cursor: "pointer",
                    border:
                      currentImageIndex === idx
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={BASE_URL + img}
                    alt={`${data?.name} thumbnail ${idx + 1}`}
                    sx={{
                      width: "100%",
                      objectFit: "contain",
                      aspectRatio: "1/1",
                    }}
                  />
                </Card>
              ))}
            </Stack>
            <Card sx={{ flexGrow: 1 }}>
              <CardMedia
                component="img"
                image={BASE_URL + data?.images[currentImageIndex]}
                alt={data?.name}
                sx={{ width: "100%", objectFit: "contain", aspectRatio: "1/1" }}
              />
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data?.name}
            </Typography>
            <Typography variant="h5" color="primary">
              ${data?.price}
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-line", mt: 3 }}
              textAlign="justify"
            >
              {data?.description}
            </Typography>
            <QuantityField
              value={quantity}
              onChange={(value) => setQuantity(value)}
              textFieldProps={{
                fullWidth: true,
                sx: { mt: 4 },
              }}
            />
            <Box display="flex" flexDirection="row" gap={1} mt={4}>
              <Button
                variant="outlined"
                startIcon={<CartIcon />}
                sx={{ flexGrow: 1 }}
                loading={isLoading}
                onClick={async () =>
                  await addToCart({ product: Number(id), quantity: quantity })
                }
              >
                Add to Cart
              </Button>
              <Button variant="contained" sx={{ flexGrow: 1 }}>
                Buy now
              </Button>
            </Box>
          </Grid2>
        </Loading>
      </Grid2>
      <BlockHeader
        label="Related items"
        title="Explore Products"
        pagination={true}
        page={page}
        pages={products?.pages}
        previousClick={() => setPage(page - 1)}
        nextClick={() => setPage(page + 1)}
      />
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
              <ProductCard product={product} params={`source=${data?.id}`} />
            </Grid2>
          ))}
        </Loading>
      </Grid2>
    </Container>
  );
}
