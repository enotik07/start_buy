import * as Yup from "yup";
import ImageUpload, { TImage } from "./ImageUpload";
import { IProduct } from "../../models/store";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import getError from "../../utils/getError";

import GenerateProductButton from "./GenerateProductButton";

import {
  useAddProductMutation,
  useGetBase64ImageMutation,
  useGetCategoriesNamesQuery,
  useUpdateProductMutation,
} from "../../store/services/storeAPI";
import { base64ToFileWithPreview } from "../../utils/imageBase64";
export interface IProductsDialogProps {
  open: boolean;
  onClose: () => void;
  product?: IProduct;
}

export interface IFormValues {
  name: string;
  description: string;
  price: number;
  images: TImage[];
  categories: number[];
  imageUrl: string;
}

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .required("Prouct name is required")
    .max(100, "Product name cannot exceed 100 characters"),
  description: Yup.string()
    .matches(/^[^\?]*$/, "Instead of ? enter the actual value")
    .required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  images: Yup.array()
    .of(Yup.mixed())
    .min(1, "At least one image is required")
    .max(5, "You can upload a maximum of 5 images"),
  categories: Yup.array()
    .of(Yup.mixed())
    .min(1, "At least one category is required"),
});

export default function ProductsDialog({
  open,
  onClose,
  product,
}: IProductsDialogProps) {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useGetCategoriesNamesQuery();

  const [getImage] = useGetBase64ImageMutation();
  const [addProduct, { isLoading: addLoading, error: addError }] =
    useAddProductMutation();
  const [updateProduct, { isLoading: updateLoading, error: updateError }] =
    useUpdateProductMutation();

  const initialValues: IFormValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    images: product?.images || [],
    categories: product?.categories || [],
    imageUrl: "",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
    >
      <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={async (values) => {
          if (product) {
            await updateProduct({
              id: product.id,
              name: values.name,
              description: values.description,
              price: values.price,
              images: values.images
                .filter((image) => typeof image !== "string")
                .map((image) => image.file),
              existing_images: values.images.filter(
                (image) => typeof image === "string"
              ),
              category_ids: values.categories,
            })
              .unwrap()
              .then(onClose);
          } else {
            await addProduct({
              name: values.name,
              description: values.description,
              price: values.price,
              images: values.images
                .filter((image) => typeof image !== "string")
                .map((image) => image.file),
              category_ids: values.categories,
            })
              .unwrap()
              .then(onClose);
          }
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
                  label="Product Name"
                  error={Boolean(touched.name && errors.name)}
                  helperText={errors.name}
                  {...getFieldProps("name")}
                />
                <GenerateProductButton
                  values={values}
                  setValues={setValues}
                  setTouched={setTouched}
                  setErrors={setErrors}
                  categories={categories}
                />
              </Box>

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={5}
                {...getFieldProps("description")}
                error={Boolean(touched.description && errors.description)}
                helperText={errors.description}
              />

              <TextField
                fullWidth
                label="Product Price"
                error={Boolean(touched.price && errors.price)}
                helperText={errors.price}
                {...getFieldProps("price")}
                type="number"
                sx={{ my: 2 }}
              />
              <Autocomplete
                multiple
                value={(categories || []).filter((option) =>
                  values.categories.includes(option.id)
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={categories || []}
                loading={isLoadingCategories}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  const ids = newValue.map((item) => item.id);
                  setValues((prev) => ({
                    ...prev,
                    categories: ids,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="categories"
                    // variant="standard"
                    label="Categories"
                    error={Boolean(
                      (touched.categories && errors.categories) ||
                        errorCategories
                    )}
                    helperText={
                      errorCategories
                        ? getError(errorCategories)
                        : errors.categories
                    }
                    onFocus={() => setTouched({ ...touched, categories: true })}
                  />
                )}
              />

              <ImageUpload
                imageFileError={
                  typeof errors.images === "string" || !errors.images
                    ? errors.images
                    : errors.images.join(", ")
                }
                setImageFileError={(error) =>
                  setErrors({ ...errors, images: error })
                }
                images={values.images ? values.images : []}
                addImage={async (image) => {
                  type ImageType = { file: File; preview: string };
                  let newImage: ImageType | undefined = undefined;
                  if (typeof image === "string") {
                    await getImage(image)
                      .unwrap()
                      .then((data) => {
                        newImage = base64ToFileWithPreview(
                          data.data,
                          data.mime_type
                        );
                      })
                      .catch((error) =>
                        setErrors({ ...errors, imageUrl: getError(error) })
                      );
                  } else newImage = image;
                  setValues((prevValues) => {
                    let newImages = [...prevValues.images, newImage].filter(
                      (image): image is TImage => image !== undefined
                    );
                    if (newImages.length > 5) newImages = newImages.slice(0, 6);
                    return {
                      ...prevValues,
                      images: newImages,
                    };
                  });
                }}
                removeImage={(index) => {
                  setValues((prevValues) => {
                    let newImages = [...prevValues.images];
                    newImages.splice(index, 1);
                    return {
                      ...prevValues,
                      images: newImages,
                    };
                  });
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
              <Collapse in={addError && !addLoading && !product}>
                <Alert severity="error">{getError(addError)}</Alert>
              </Collapse>
              <Collapse in={Boolean(updateError && !updateLoading && product)}>
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
