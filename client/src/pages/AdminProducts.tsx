import { useState } from "react";
import { IFilter, IProduct } from "../models/store";
import { Container, Box, Typography, Button, Stack, Chip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Search from "../components/common/Search";
import ProductsDialog from "../components/adminPanel/ProductsDialog";
import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../store/services/storeAPI";
import AdminTable from "../components/adminPanel/AdminTable";
import { BASE_URL } from "../helpers/config";
import ConfirmDialog from "../components/adminPanel/ConfirmDialog";

export default function AdminProducts() {
  const [filter, setFilter] = useState<IFilter>({
    page: 1,
    page_size: 10,
    query: "",
  });
  const { data, isLoading, error, refetch } = useGetProductsQuery(filter);
  const { data: categories } = useGetCategoriesQuery({
    page: 1,
    page_size: 1000,
    query: "",
  });
  const [deleteProduct, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteProductMutation();
  const [modal, setModal] = useState<{
    type?: "add" | "delete";
    product?: IProduct;
  }>({});
  const addOnClick = () => setModal({ type: "add" });
  const editOnClick = (item: any) => setModal({ type: "add", product: item });
  const deleteOnClick = (item: any) =>
    setModal({ type: "delete", product: item });
  const onClose = () => setModal({});

  const deleteConfirm = async () => {
    if (!modal.product) return;
    await deleteProduct(modal.product.id).unwrap().then(onClose);
  };
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Products Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addOnClick}
        >
          Add Product
        </Button>
      </Box>
      <Search
        placeholder="Search products..."
        fullwidth
        inputProps={{
          value: filter.query,
          onChange: (e) =>
            setFilter((prev) => ({ ...prev, page: 1, query: e.target.value })),
        }}
      />
      <AdminTable
        columns={["Image", "Name", "Price", "Categories"]}
        data={data}
        values={(item) => [
          <Stack
            direction="row"
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={1}
          >
            {item.images.map((image, index) => (
              <img
                key={index}
                src={BASE_URL + image}
                width={"fit-content"}
                height={"100px"}
              />
            ))}
          </Stack>,
          item.name,
          item.price,
          <Stack direction="row" spacing={1}>
            {categories?.results &&
              item.categories.map((categoryId) => {
                const category = categories.results.find(
                  (cat) => cat.id === categoryId
                );
                return <Chip key={categoryId} label={category?.name || ""} />;
              })}
          </Stack>,
        ]}
        filter={filter}
        onFilterChange={(name, value) =>
          setFilter((prev) => ({ ...prev, [name]: value }))
        }
        error={error}
        loading={isLoading}
        editOnClick={editOnClick}
        deleteOnClick={deleteOnClick}
        refetch={refetch}
      />
      <ProductsDialog
        open={modal.type === "add"}
        onClose={onClose}
        product={modal.product}
      />
      <ConfirmDialog
        title={`Are you sure you want to delete "${modal.product?.name}" product?`}
        onClose={onClose}
        open={modal.type === "delete"}
        onCorfirm={deleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />
    </Container>
  );
}
