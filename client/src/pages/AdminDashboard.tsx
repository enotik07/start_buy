import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetStatisticsQuery,
} from "../store/services/storeAPI";
import Loading, { ErrorLabel } from "../components/common/Loading";
import {
  Inventory as InventoryIcon,
  Sell as SellIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { createElement, Fragment } from "react";
import { BASE_URL } from "../helpers/config";

const Icons = [InventoryIcon, SellIcon, ShoppingCartIcon, TrendingUpIcon];

export default function AdminDashboard() {
  const {
    data: statistics,
    isFetching: statisticsLoading,
    error: statisticsError,
    refetch: statisticsRefetch,
  } = useGetStatisticsQuery();

  const {
    data: categories,
    isFetching: categoriesLoading,
    error: categoriesError,
    refetch: categoriesRefetch,
  } = useGetCategoriesQuery({
    page: 1,
    page_size: 5,
    query: "",
  });

  const {
    data: products,
    isFetching: productsLoading,
    error: productsError,
    refetch: productsRefetch,
  } = useGetProductsQuery({
    page: 1,
    page_size: 5,
    query: "",
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid2 container spacing={2}>
        <Loading
          loading={statisticsLoading}
          error={statisticsError}
          skeleton={
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Skeleton variant="rectangular" height="158.5px" />
                </Grid2>
              ))}
            </>
          }
          errorComponent={
            <Grid2
              size={12}
              height="158.5px"
              display="flex"
              alignItems="center"
            >
              <ErrorLabel error={statisticsError} refetch={statisticsRefetch} />
            </Grid2>
          }
        >
          {statistics?.map((statistic, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h5" gutterBottom>
                      {statistic.title}
                    </Typography>
                    {createElement(Icons[index], {
                      fontSize: "large",
                      color: "secondary",
                    })}
                  </Box>
                  <Typography variant="h4" color="primary">
                    {statistic.count}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {statistic.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Loading>
        <Grid2 size={{ xs: 12, md: 6 }} minHeight={"459.7px"}>
          <Loading
            loading={productsLoading}
            error={productsError}
            skeleton={
              <Skeleton variant="rectangular" height="100%" width="100%" />
            }
            errorComponent={
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <ErrorLabel error={productsError} refetch={productsRefetch} />
                </CardContent>
              </Card>
            }
          >
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Recent Products
                </Typography>
                <List>
                  {products &&
                    products.results.map((product, index) => (
                      <Fragment key={product.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              variant="rounded"
                              src={BASE_URL + product.images[0]}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.name}
                            secondary={`$${product.price}`}
                            sx={{ flexGrow: 1 }}
                          />
                          <ListItemText
                            secondary={product.time_since_created}
                            sx={{
                              width: "fit-content",
                              flex: "unset",
                              whiteSpace: "nowrap",
                            }}
                            slotProps={{
                              secondary: {
                                width: "fit-content",
                              },
                            }}
                          />
                        </ListItem>
                        {index !== products.results.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Fragment>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Loading>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} minHeight={"459.7px"}>
          <Loading
            loading={categoriesLoading}
            error={categoriesError}
            skeleton={
              <Skeleton variant="rectangular" height="100%" width="100%" />
            }
            errorComponent={
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <ErrorLabel
                    error={categoriesError}
                    refetch={categoriesRefetch}
                  />
                </CardContent>
              </Card>
            }
          >
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Recent Categories
                </Typography>
                <List>
                  {categories &&
                    categories.results.map((category, index) => (
                      <Fragment key={index}>
                        <ListItem key={category.id}>
                          <ListItemAvatar>
                            <Avatar
                              variant="rounded"
                              src={
                                category.icon.includes("http")
                                  ? category.icon
                                  : BASE_URL + category.icon
                              }
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={category.name}
                            secondary={`${category.products} products`}
                            sx={{ flexGrow: 1 }}
                          />
                          <ListItemText
                            secondary={category.time_since_created}
                            sx={{
                              width: "fit-content",
                              flex: "unset",
                              whiteSpace: "nowrap",
                            }}
                            slotProps={{
                              secondary: {
                                width: "fit-content",
                              },
                            }}
                          />
                        </ListItem>
                        {index !== categories.results.length - 1 && (
                          <Divider component="li" />
                        )}
                      </Fragment>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Loading>
        </Grid2>
      </Grid2>
    </Container>
  );
}
