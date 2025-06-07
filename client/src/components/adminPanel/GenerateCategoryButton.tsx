import { FormikValues, FormikErrors, FormikTouched } from "formik";
import * as React from "react";
import { useChatMutation } from "../../store/services/aiAPI";
import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import {
  generateCategoryDescription,
  generateCategoryIcon,
} from "../../helpers/aiConfig";
import { IFormValues } from "./CategoryDialog";

export interface IGenerateCategoryButttonProps {
  values: FormikValues;
  setValues: (updater: (prevValues: IFormValues) => IFormValues) => void;
  setErrors: (errors: Partial<FormikErrors<IFormValues>>) => void;
  setTouched: (touched: FormikTouched<IFormValues>) => void;
}

export default function GenerateCategoryButtton({
  values,
  setValues,
  setErrors,
  setTouched,
}: IGenerateCategoryButttonProps) {
  const [generate, { isLoading: generateLoading }] = useChatMutation();
  
  const handleClick = async () => {
    if (!values.name) {
      setErrors({ name: "Product name is required" });
      setTouched({ ...setTouched, name: true });
      return;
    }
    const descriptionPromise = generate({
      content: [
        {
          type: "text",
          text: generateCategoryDescription.prompt(values.name),
        },
      ],
      model: generateCategoryDescription.model,
    })
      .unwrap()
      .then((result) => {
        console.log("Description Result:", result);
        const generatedText =
          result.choices[0]?.message?.content || "No description generated";
        console.log("Generated Text:", generatedText);
        setValues((prev) => ({
          ...prev,
          description: generatedText as string,
        }));
      })
      .catch(() => setErrors({ description: "Error generating description" }));

    const iconPromise = generate({
      content: [
        {
          type: "text",
          text: generateCategoryIcon.prompt(values.name),
        },
      ],
      model: generateCategoryIcon.model,
    })
      .unwrap()
      .then((result) => {
        console.log("Icon Result:", result);
        const generatedSVG = result.choices[0]?.message?.content;
        console.log("Generated SVG:", generatedSVG);
        if (generatedSVG) {
          const match = (generatedSVG as string).match(/<svg[\s\S]*?<\/svg>/);
          const svg = match ? match[0] : undefined;
          if (!svg) return;
          const blob = new Blob([svg], {
            type: "image/svg+xml",
          });
          const file = new File(
            [blob],
            `${
              values.name.replace(/\s+/g, "_") + "-" + crypto.randomUUID()
            }.svg`,
            {
              type: "image/svg+xml",
            }
          );
          const preview = URL.createObjectURL(blob);
          setValues((prev) => ({ ...prev, image: { file, preview } }));
        }
      })
      .catch(() => setErrors({ image: "Error generating description" }));

    await Promise.all([descriptionPromise, iconPromise]);
  };

  return (
    <Button
      loading={generateLoading}
      variant="outlined"
      startIcon={<AutoAwesomeIcon />}
      sx={{ minWidth: "150px", height: "56px" }}
      onClick={handleClick}
    >
      Generate
    </Button>
  );
}
