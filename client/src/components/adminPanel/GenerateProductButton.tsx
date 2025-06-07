import { IFormValues } from "./ProductsDialog";
import { FormikErrors, FormikTouched, FormikValues } from "formik";
import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import {
  base64ToFileWithPreview,
  imageToBase64,
} from "../../utils/imageBase64";
import { useChatMutation } from "../../store/services/aiAPI";
import {
  generateProductCategories,
  generateProductDescription,
  generateProductImage,
  generateProductPrice,
} from "../../helpers/aiConfig";
import { useGenerateImageMutation } from "../../store/services/aiStudioAPI";
import { Button } from "@mui/material";
import { TImage } from "./ImageUpload";
import { useGetBase64ImageMutation } from "../../store/services/storeAPI";
import { ICategoryName } from "../../models/store";

const getImageUrl = (mime_type: string, data: string) => {
  return `data:${mime_type};base64,${data}`;
};

export interface IGenerateProductButtonProps {
  values: FormikValues;
  setValues: (updater: (prevValues: IFormValues) => IFormValues) => void;
  setErrors: (errors: Partial<FormikErrors<IFormValues>>) => void;
  setTouched: (touched: FormikTouched<IFormValues>) => void;
  categories?: ICategoryName[];
}

export default function GenerateProductButton({
  values,
  setValues,
  setErrors,
  setTouched,
  categories,
}: IGenerateProductButtonProps) {
  const [generate, { isLoading: generateLoading }] = useChatMutation();
  const [generateImage, { isLoading: generateImageLoading }] =
    useGenerateImageMutation();
  const [getImage] = useGetBase64ImageMutation();

  const handleClick = async () => {
    if (!values.name) {
      setErrors({ name: "Product name is required" });
      setTouched({ ...setTouched, name: true });
      return;
    }
    if (values.images.length === 0) {
      setTouched({ ...setTouched, name: true, images: true });
      setErrors({
        images: "At least one image is required",
        name: "At least one image is required",
      });
      return;
    }
    let image = values.images[0] as TImage;
    let imageUrl: { mime_type: string; data: string } | undefined;
    if (typeof image === "string") {
      await getImage(image)
        .unwrap()
        .then((data) => {
          imageUrl = data;
        })
        .catch((error) =>
          console.error("Error converting image to base64:", error)
        );
    } else {
      await imageToBase64(image.file)
        .then((data) => {
          imageUrl = data;
        })
        .catch((error) =>
          console.error("Error converting image to base64:", error)
        );
    }
    if (!imageUrl || !categories) return;
    let generatedData: {
      description: string;
      price: number;
      categories: number[];
      images: { file: File; preview: string }[];
    } = {
      description: "",
      price: 0,
      categories: [],
      images: [],
    };
    const descriptionPromise = generate({
      content: [
        {
          type: "text",
          text: generateProductDescription.prompt(values.name),
        },
        {
          type: "image_url",
          image_url: {
            url: getImageUrl(imageUrl.mime_type, imageUrl.data),
          },
        },
      ],
      model: generateProductDescription.model,
    })
      .unwrap()
      .then((result) => {
        const generatedText =
          result.choices[0]?.message?.content || "No description generated";
        generatedData.description = generatedText as string;
      })
      .catch(() => setErrors({ description: "Error generating description" }));

    const pricePromise = generate({
      content: [
        {
          type: "text",
          text: generateProductPrice.prompt(values.name),
        },
        {
          type: "image_url",
          image_url: {
            url: getImageUrl(imageUrl.mime_type, imageUrl.data),
          },
        },
      ],
      model: generateProductPrice.model,
    })
      .unwrap()
      .then((result) => {
        console.log("Price Result:", result);
        const generatedText =
          result.choices[0]?.message?.content || "No price generated";
        generatedData.price = Number(generatedText);
      })
      .catch(() => setErrors({ price: "Error generating price" }));

    const categoriesPromise = generate({
      content: [
        {
          type: "text",
          text: generateProductCategories.prompt(
            values.name,
            categories
          ),
        },
      ],
      model: generateProductCategories.model,
    })
      .unwrap()
      .then((result) => {
        const generatedText =
          result.choices[0]?.message?.content || "No Categories generated";
        const categoryIds = (generatedText as string)
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
        generatedData.categories = categoryIds;
      })
      .catch(() => setErrors({ price: "Error generating price" }));

    const imagePromise = generateImage({
      mime_type: imageUrl.mime_type,
      imageBase64: imageUrl.data,
      text: generateProductImage.prompt(values.name),
    })
      .unwrap()
      .then((result) => {
        const image = base64ToFileWithPreview(
          result.candidates[0].content.parts[0].inlineData.data,
          result.candidates[0].content.parts[0].inlineData.mimeType
        );
        generatedData.images = [image];
      })
      .catch(() => setErrors({ price: "Error generating Image" }));
    await Promise.all([
      descriptionPromise,
      pricePromise,
      categoriesPromise,
      imagePromise,
    ]);
    setValues((prev) => ({
      ...prev,
      description: generatedData.description,
      price: generatedData.price,
      categories: generatedData.categories,
      images: [...prev.images, ...generatedData.images],
    }));
  };
  return (
    <Button
      loading={generateLoading || generateImageLoading}
      variant="outlined"
      startIcon={<AutoAwesomeIcon />}
      sx={{ minWidth: "150px", height: "56px" }}
      onClick={handleClick}
    >
      Generate
    </Button>
  );
}
