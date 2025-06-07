import {
  Autocomplete,
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  IconButton,
  Pagination,
  Radio,
  RadioGroup,
  Skeleton,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetCategoriesNamesQuery,
  useGetRecommendsProductsQuery,
} from "../store/services/storeAPI";
import Loading from "../components/common/Loading";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import ProductCard from "../components/products/ProductCard";
import { FilterAlt as FilterAltIcon } from "@mui/icons-material";
import { IProductFilter, SortEnum } from "../models/store";
import getError from "../utils/getError";

const drawerWidth = 300;
const products_count = 20;

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<IProductFilter>({
    page: 1,
    page_size: products_count,
    categories: [],
    price_min: 0,
    price_max: 20000,
    query: searchParams.get("query") || "",
  });
  const { data, isFetching, error, refetch } =
    useGetRecommendsProductsQuery(filter);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useGetCategoriesNamesQuery();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerClose = () => setMobileOpen(false);
  const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilter((prev) => ({ ...prev, page: value }));
  };

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      categories: [],
      price_min: 0,
      price_max: 20000,
      sort: undefined,
      query: searchParams.get("query") || "",
      page: 1,
    }));
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  const price_range = [filter.price_min || 0, filter.price_max || 20000];

  const minChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || 0;
    setFilter((prev) => ({
      ...prev,
      price_min: value,
      page: 1,
    }));
  };
  const maxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || 20000;
    setFilter((prev) => ({
      ...prev,
      price_max: value,
      page: 1,
    }));
  };
  const handleChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    if (Array.isArray(value)) {
      setFilter((prev) => ({
        ...prev,
        price_min: value[0],
        price_max: value[1],
        page: 1,
      }));
    }
  };

  const sortHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({
      ...prev,
      sort: (event.target as HTMLInputElement).value as SortEnum,
      page: 1,
    }));
  };

  const clear = () => {
    setFilter((prev) => ({
      ...prev,
      categories: [],
      price_min: 0,
      price_max: 20000,
      sort: undefined,
      query: "",
      page: 1,
    }));
  };

  const drawer = () => (
    <>
      {filter.query && filter.query != "" && (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          Search query:{" "}
          <Typography
            variant="subtitle1"
            color="textPrimary"
            textTransform="uppercase"
          >
            {filter.query}
          </Typography>
        </Typography>
      )}

      <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
        Categories
      </Typography>
      <Autocomplete
        multiple
        value={(categories || []).filter((option) =>
          filter.categories?.includes(option.id)
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={categories || []}
        loading={isLoadingCategories}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          const ids = newValue.map((item) => item.id);
          setFilter((prev) => ({
            ...prev,
            categories: ids,
            page: 1,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={filter.categories?.length === 0 ? "All" : ""}
            name="categories"
            error={Boolean(errorCategories)}
            helperText={error ? getError(errorCategories) : ""}
          />
        )}
      />
      <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
        Price Range
      </Typography>
      <Slider
        getAriaLabel={() => "Price range"}
        value={price_range}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={20000}
      />
      <Box display="flex" justifyContent="space-between" mt={1} mb={3}>
        <TextField
          type="text"
          label="Min"
          onChange={minChange}
          sx={{ width: "100px" }}
        />
        <TextField
          type="text"
          label="Max"
          onChange={maxChange}
          sx={{ width: "100px" }}
        />
      </Box>
      <FormControl>
        <FormLabel>Sort By</FormLabel>
        <RadioGroup value={filter.sort ?? ""} onChange={sortHandleChange}>
          <FormControlLabel
            value={SortEnum.popularity}
            control={<Radio />}
            label="Popularity"
          />
          <FormControlLabel
            value={SortEnum.newest}
            control={<Radio />}
            label="Newest"
          />
          <FormControlLabel
            value={SortEnum.priceLowToHigh}
            control={<Radio />}
            label="Price: Low to High"
          />
          <FormControlLabel
            value={SortEnum.priceHightToLow}
            control={<Radio />}
            label="Price: High to Low"
          />
        </RadioGroup>
      </FormControl>
      <Button onClick={clear} fullWidth variant="contained" sx={{ mt: 3 }}>
        Clear All Filters
      </Button>
    </>
  );
  return (
    <Container maxWidth="xl" sx={{ pb: 4 }}>
      <Box display="flex" flexDirection="row">
        <Box
          width={drawerWidth}
          minWidth={drawerWidth}
          paddingRight="24px"
          pt={4}
          display={{ xs: "none", md: "block" }}
          position="sticky"
          top={0}
          alignSelf="flex-start"
          height="fit-content"
        >
          {drawer()}
        </Box>
        <Box pt={4} width="100%">
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Box display={{ md: "none" }}>
              {isFetching ? (
                <Skeleton variant="circular" width={40} height={40} />
              ) : (
                <IconButton onClick={() => setMobileOpen(true)}>
                  <FilterAltIcon color="primary" />
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" minWidth="200px">
              {isFetching ? <Skeleton /> : `Showing ${data?.count} products`}
            </Typography>
          </Stack>
          <Grid2 container spacing={3} width="100%" maxWidth="100%">
            <Loading
              loading={isFetching}
              error={error}
              refetch={refetch}
              skeleton={Array.from({ length: products_count }).map(
                (_, index) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <ProductCardSkeleton />
                  </Grid2>
                )
              )}
            >
              {data?.results.map((product) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                  <ProductCard
                    product={product}
                    params={filter.query ?? `query=${filter.query}`}
                  />
                </Grid2>
              ))}
              {data && data.pages > 1 && (
                <Pagination
                  count={data.pages}
                  variant="outlined"
                  color="primary"
                  page={filter.page}
                  onChange={pageChange}
                  size="large"
                  sx={{
                    width: "100%",
                    paddingTop: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              )}
            </Loading>
          </Grid2>
        </Box>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            p: 2,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true,
          },
        }}
      >
        {drawer()}
      </Drawer>
    </Container>
  );
}
