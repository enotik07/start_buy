import { Box, Button, Container, Typography } from "@mui/material";
import Search from "../components/common/Search";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { ICategory, IFilter } from "../models/store";
import CategoryDialog from "../components/adminPanel/CategoryDialog";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../store/services/storeAPI";
import AdminTable from "../components/adminPanel/AdminTable";
import { BASE_URL } from "../helpers/config";
import ConfirmDialog from "../components/adminPanel/ConfirmDialog";

export default function AdminCategories() {
  const [filter, setFilter] = useState<IFilter>({
    page: 1,
    page_size: 10,
    query: "",
  });
  const [modal, setModal] = useState<{
    type?: "add" | "delete";
    category?: ICategory;
  }>({});

  const { data, isLoading, error, refetch } = useGetCategoriesQuery(filter);
  const [deleteCategory, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteCategoryMutation();
    
  const addOnClick = () => setModal({ type: "add" });
  const editOnClick = (item: ICategory) =>
    setModal({ type: "add", category: item });
  const deleteOnClick = (item: ICategory) =>
    setModal({ type: "delete", category: item });
  const onClose = () => setModal({});

  const deleteConfirm = async () => {
    if (!modal.category) return;
    await deleteCategory(modal.category.id).unwrap().then(onClose);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Categories Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addOnClick}
        >
          Add Category
        </Button>
      </Box>
      <Search
        placeholder="Search categories..."
        fullwidth
        inputProps={{
          value: filter.query,
          onChange: (e) =>
            setFilter((prev) => ({ ...prev, page: 1, query: e.target.value })),
        }}
      />
      <AdminTable
        columns={["Icon", "Name", "Description", "Products"]}
        data={data}
        values={(item) => [
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <img
              src={
                item.icon.includes("http") ? item.icon : BASE_URL + item.icon
              }
              width={"fit-content"}
              height={"50px"}
            />
          </Box>,
          item.name,
          item.description,
          item.products,
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
      <CategoryDialog
        open={modal.type === "add"}
        onClose={onClose}
        category={modal.category}
      />
      <ConfirmDialog
        title={`Are you sure you want to delete "${modal.category?.name}" category?`}
        onClose={onClose}
        open={modal.type === "delete"}
        onCorfirm={deleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />
    </Container>
  );
}
