import { ICategory, IUpdateCategory } from "../../models/store";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Collapse,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ImageUpload, { TImage } from "./ImageUpload";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../store/services/storeAPI";
import getError from "../../utils/getError";
import GenerateCategoryButtton from "./GenerateCategoryButton";

export interface IFormValues {
  name: string;
  description: string;
  imageUrl: string;
  image: TImage | null;
}

export interface ICategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: ICategory;
}

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .max(50, "Category name cannot exceed 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(250, "Description cannot exceed 250 characters"),
  image: Yup.mixed().required("Image is required"),
});

export default function CategoryDialog({
  open,
  onClose,
  category,
}: ICategoryDialogProps) {
  const [addCategory, { isLoading: addLoading, error: addError }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: updateLoading, error: updateError }] =
    useUpdateCategoryMutation();

  const initialValues: IFormValues = {
    name: category?.name || "",
    description: category?.description || "",
    imageUrl: "",
    image: category ? category.icon : null,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
    >
      <DialogTitle>
        {category ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        onSubmit={async (values) => {
          if (category) {
            const data: IUpdateCategory = {
              id: category.id,
              name: values.name,
              description: values.description,
            };
            if (values.image && values.image !== category.icon) {
              if (typeof values.image === "string")
                data.image_url = values.image;
              else data.image = values.image.file;
            }
            console.log(data);
            await updateCategory(data)
              .unwrap()
              .then(() => onClose());
          } else
            await addCategory({
              name: values.name,
              description: values.description,
              image:
                values.image && typeof values.image !== "string"
                  ? values.image.file
                  : undefined,
              image_url:
                typeof values.image === "string" ? values.image : undefined,
            })
              .unwrap()
              .then(() => onClose());
        }}
      >
        {({
          errors,
          touched,
          getFieldProps,
          values,
          setValues,
          setErrors,
          setTouched,
        }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Category Name"
                  error={Boolean(touched.name && errors.name)}
                  helperText={errors.name}
                  {...getFieldProps("name")}
                />
                <GenerateCategoryButtton
                  values={values}
                  setValues={setValues}
                  setTouched={setTouched}
                  setErrors={setErrors}
                />
              </Box>

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...getFieldProps("description")}
                error={Boolean(touched.description && errors.description)}
                helperText={
                  errors.description ||
                  `${values.description.length}/250 characters`
                }
              />

              <ImageUpload
                imageFileError={errors.image}
                setImageFileError={(error) =>
                  setErrors({ ...errors, image: error })
                }
                images={values.image ? [values.image] : []}
                addImage={(image) => {
                  setValues((prevValues) => ({ ...prevValues, image }));
                }}
                removeImage={() => {
                  setValues((prevValues) => ({ ...prevValues, image: null }));
                }}
                imageUrl={{
                  value: values.imageUrl,
                  error: errors.imageUrl,
                  touched: touched.imageUrl,
                  getProps: () => getFieldProps("imageUrl"),
                  setError: (error) =>
                    setErrors({ ...errors, imageUrl: error }),
                }}
              />
              <Collapse in={addError && !addLoading && !category}>
                <Alert severity="error">{getError(addError)}</Alert>
              </Collapse>
              <Collapse in={Boolean(updateError && !updateLoading && category)}>
                <Alert severity="error">{getError(updateError)}</Alert>
              </Collapse>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={addLoading || updateLoading}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
