import { Delete, FileUpload as FileUploadIcon } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FieldInputProps } from "formik";
import * as React from "react";
import { useCallback } from "react";
import { BASE_URL } from "../../helpers/config";

export const checkImage = (
  url: string,
  onload: () => void,
  onerror: () => void
) => {
  const img = new Image();
  img.src = url;
  img.onload = () => onload();
  img.onerror = () => onerror();
};

const ImagePreviewGrid = styled(ImageList)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
export type TImage = string | { file: File; preview: string };

export interface IImageUploadProps {
  imageFileError?: string;
  setImageFileError: (error?: string) => void;
  images: TImage[];
  addImage: (image: TImage) => void;
  removeImage: (index: number) => void;
  imageUrl: {
    value: string;
    error: string | undefined;
    touched?: boolean;
    getProps: () => FieldInputProps<unknown>;
    setError: (error: string | undefined) => void;
  };
}

export default function ImageUpload({
  imageFileError,
  images,
  imageUrl,
  addImage,
  removeImage,
  setImageFileError,
}: IImageUploadProps) {
  const UploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${
      imageFileError ? theme.palette.error.main : theme.palette.secondary.main
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    transition: "border 0.3s ease",
    "&:hover": {
      border: `2px dashed ${theme.palette.primary.main}`,
    },
  }));
  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageFileError("Invalid file type. Supported: JPG, PNG, WebP, SVG");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageFileError("File size must not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      addImage({ file, preview: reader.result as string });
    };
    reader.readAsDataURL(file);
    setImageFileError(undefined);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, []);
  const theme = useTheme();

  const addImageUrl = () => {
    checkImage(
      imageUrl.value,
      () => addImage(imageUrl.value),
      () => imageUrl.setError("Invalid image URL")
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          label="Image URL"
          {...imageUrl.getProps()}
          error={Boolean(imageUrl.touched && imageUrl.error)}
          helperText={imageUrl.error}
        />
        <Button
          variant="outlined"
          onClick={addImageUrl}
          sx={{ minWidth: "150px", height: "56px" }}
        >
          Add Image
        </Button>
      </Box>
      <UploadBox
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{ mt: 2 }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/jpeg,image/png,image/webp,image/svg+xml";
          input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
              handleImageUpload(target.files[0]);
            }
          };
          input.click();
        }}
      >
        <FileUploadIcon fontSize="large" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Drag and drop your images here, or click to select
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: JPG, PNG, WebP, SVG (max 5MB)
        </Typography>
      </UploadBox>
      {imageFileError && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: "3px", mx: "14px" }}
        >
          {imageFileError}
        </Typography>
      )}
      {images.length > 0 && (
        <ImagePreviewGrid cols={3} rowHeight={200} gap={8}>
          {images.map((image, index) => (
            <ImageListItem
              key={index}
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <img
                src={typeof image === "string" ? image.includes('http') ? image : BASE_URL + image : image.preview}
                alt={`Upload preview ${index + 1}`}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  width: "fit-content",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: alpha(theme.palette.text.primary, 0.7),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.text.primary, 0.9),
                  },
                }}
                onClick={() => removeImage(index)}
              >
                <Delete color="secondary" />
              </IconButton>
            </ImageListItem>
          ))}
        </ImagePreviewGrid>
      )}
    </>
  );
}
