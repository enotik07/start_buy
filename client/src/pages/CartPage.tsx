import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid2,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Fragment, useEffect, useState } from "react";
import {
  useDeleteCartItemMutation,
  useGetCartQuery,
} from "../store/services/storeAPI";
import { BASE_URL } from "../helpers/config";
import QuantityField from "../components/products/QuantityField";
import Loading from "../components/common/Loading";
import ConfirmDialog from "../components/adminPanel/ConfirmDialog";

const page_size = 10;
export default function CartPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, error, refetch } = useGetCartQuery({
    page,
    page_size,
  });
  const [deleteItem, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteCartItemMutation();
  const [deleteId, setDeleteId] = useState<number>();
  useEffect(() => {
    if (data) {
      setSelectedItems([]);
      setQuantity({});
    }
  }, [data]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const selectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(data?.results.map((item) => item.id) || []);
    } else {
      setSelectedItems([]);
    }
  };

  const selectAllChecked = data?.results.length === selectedItems.length;
  const selectAllIndeterminate = !selectAllChecked && selectedItems.length > 0;

  const [quantity, setQuantity] = useState<{ [key: number]: number }>({});

  const updateValue = (key: number, value: number) => {
    setQuantity((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const getQuantity = (id: number): number => {
    let savedValue = 1;
    data?.results.forEach((item) => {
      if (item.id === id) savedValue = item.quantity;
    });
    return quantity[id] ?? savedValue;
  };
  const getTotalPrice = () => {
    let result = 0;
    data?.results.forEach((item) => {
      if (selectedItems.includes(item.id)) {
        result += item.product.price * (quantity[item.id] ?? item.quantity);
      }
    });
    return result;
  };

  const deleteConfirm = async () => {
    if(!deleteId) return;
    await deleteItem(deleteId);
    setDeleteId(undefined);
  }
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4">Shopping Cart</Typography>
      <Grid2 container spacing={3} width="100%">
        <Grid2 size={{ xs: 12, md: 8 }} p={2}>
          <Loading
            loading={isFetching}
            error={error}
            refetch={refetch}
            skeleton={
              <>
                <Skeleton variant="rounded" height="42px" />
                <Divider sx={{ my: 1 }} />
                {Array.from({ length: page_size }).map((_, index) => (
                  <Fragment key={index}>
                    <Skeleton variant="rounded" height="100px" />
                    <Divider sx={{ my: 1 }} />
                  </Fragment>
                ))}
              </>
            }
          >
            {data && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pl={1}
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAllChecked}
                        indeterminate={selectAllIndeterminate}
                        onChange={selectAllChange}
                      />
                    }
                    label="Select All"
                  />
                  <Typography variant="body1" color="textSecondary">
                    {data.count} items
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {data.results.map((item) => (
                  <Fragment key={item.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedItems((prev) => [...prev, item.id]);
                          else
                            setSelectedItems((prev) =>
                              prev.filter((i) => i != item.id)
                            );
                        }}
                      />
                      <img
                        src={BASE_URL + item.product.image}
                        style={{
                          objectFit: "contain",
                          aspectRatio: "1/1",
                        }}
                        height={"100px"}
                      />
                      <Box flexGrow={1} minWidth={0}>
                        <Typography
                          variant="body1"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            minWidth: 0,
                            boxSizing: "border-box",
                          }}
                        >
                          {item.product.name}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                          ${item.product.price}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                          <QuantityField
                            value={getQuantity(item.id)}
                            onChange={(value) => updateValue(item.id, value)}
                            textFieldProps={{
                              sx: { width: "150px" },
                              size: "small",
                            }}
                          />
                          <IconButton onClick={()=>setDeleteId(item.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Stack>
                      </Box>
                      <Typography
                        sx={{ display: { xs: "none", md: "block" } }}
                        variant="subtitle1"
                        fontWeight={600}
                        minWidth="70px"
                        textAlign="right"
                      >
                        $
                        {(item.product.price * getQuantity(item.id)).toFixed(2)}
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                  </Fragment>
                ))}
                {data.pages > 1 && (
                  <Pagination
                    count={data.pages}
                    variant="outlined"
                    color="primary"
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    size="large"
                    sx={{
                      width: "100%",
                      paddingTop: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                )}
              </>
            )}
          </Loading>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: "sticky", top: 0, alignSelf: "flex-start" }}>
            <CardContent component={Stack} spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" color="textSecondary">
                  Selected Items ({selectedItems.length})
                </Typography>
                <Typography variant="subtitle1">${getTotalPrice()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" color="textSecondary">
                  Shipping
                </Typography>
                <Typography variant="subtitle1">
                  ${getTotalPrice() > 200 ? 0 : 100}
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  $
                  {getTotalPrice() > 200
                    ? getTotalPrice()
                    : getTotalPrice() + 100}
                </Typography>
              </Box>
              <Button variant="contained" fullWidth>
                Buy
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <ConfirmDialog
        title={`Are you sure you want to delete product from cart?`}
        onClose={()=>setDeleteId(undefined)}
        open={deleteId!=undefined}
        onCorfirm={deleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />
    </Container>
  );
}
