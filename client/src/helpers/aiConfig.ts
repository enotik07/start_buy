import { ICategoryName } from "../models/store";

export enum AI_MODELS {
  GEMINI = "google/gemini-2.0-flash-exp:free",
  QWEN = "qwen/qwen2.5-vl-3b-instruct:free",
  GEMMA = "google/gemma-3-4b-it:free",
  ALEN = "allenai/molmo-7b-d:free",
  QWERKY = "featherless/qwerky-72b:free",
  MISTRAL = "mistralai/mistral-small-3.1-24b-instruct:free",
  OLYMPIC_CODER = "open-r1/olympiccoder-32b:free",
  REKA = "rekaai/reka-flash-3:free",
  QWEN_CODER = "qwen/qwen-2.5-coder-32b-instruct:free",
  LLAMA = "nvidia/llama-3.1-nemotron-70b-instruct:free",
  MOONSHOT = "moonshotai/moonlight-16b-a3b-instruct:free",
  DEEPHERMES = "nousresearch/deephermes-3-llama-3-8b-preview:free",
  DOLPHIN = "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  PHI = "microsoft/phi-3-medium-128k-instruct:free",
  MYTHOMAX = "gryphe/mythomax-l2-13b:free",
  LEARNLM = "google/learnlm-1.5-pro-experimental:free",
  THUDM = "thudm/glm-z1-32b:free",
  SHISA = "shisa-ai/shisa-v2-llama3.3-70b:free",
  ARLIAI = "arliai/qwq-32b-arliai-rpr-v1:free",
  DEEPCODER = "agentica-org/deepcoder-14b-preview:free",
  LLAMA3 = "nvidia/llama-3.3-nemotron-super-49b-v1:free",
  OLYMPICCODER = "open-r1/olympiccoder-7b:free",
}

export const generateCategoryDescription = {
  model: AI_MODELS.QWEN,
  prompt: (category: string) =>
    `You are an AI copywriter. Generate a short, SEO-optimized category description (maximum 250 characters) based on the category name. Use relevant keywords to improve search visibility. Make the text clear, appealing, and professional.

Input:
- Category Name: ${category}

Output:
- Short category description (max 250 characters) with SEO keywords. 
- The response should contain only the description without any additional text or explanation.`,
};

export const generateCategoryIcon = {
  model: AI_MODELS.GEMINI,
  prompt: (category: string) =>
    `You are an AI icon designer. Generate a relevant, clear, and non-abstract SVG icon based on the given category name. The icon should visually represent the category in a simple and understandable way. Avoid abstract shapes or generic symbols. It must be directly associated with the meaning of the category.

Requirements:
- Output only valid and minimal inline SVG code.
- Use a size of 24x24 or 48x48 viewBox.
- No text or labels inside the SVG.
- Make it suitable for web use (stroke or fill-based, simple style).
- The icon should use currentColor for the color property

Input:
- Category Name: ${category}

Output:
- SVG icon code that clearly represents the category.
- The response should contain only the SVG code without any additional text or explanation
  `,
};

export const generateProductDescription = {
  model: AI_MODELS.GEMMA,
  prompt: (product: string) =>
    `You are an AI product description generator. Your task is to create a detailed, SEO-optimized product description based on the product title and image. The description should be persuasive, informative, and include a list of key features and specifications if identifiable from the image or commonly expected for the product type.
  
If any detail is unclear or cannot be determined from the title and image, insert a question mark (?) as a placeholder to indicate that the user should provide the correct value.

Requirements:
- Start with a catchy and informative paragraph describing the product.
- Include a bullet-point list of specifications or features.
- Use relevant keywords for SEO based on the product type.
- Maintain a professional and friendly tone.
- Do not invent details if they cannot be reasonably assumed. Use ? where information is missing.
- The response should contain only the description without any additional text or explanation and must not exceed 1000 characters

Input:
- Product Title: ${product}
- Product Image

Output:
- Product Description with SEO keywords
- List of Key Features and Specifications`,
};

export const generateProductPrice = {
  model: AI_MODELS.QWEN,
  prompt: (product: string) =>
    `You are an AI pricing assistant. Based on the given product title and image, generate a reasonable price for the product in US dollars. Provide only the price as a positive number without any explanations or additional text.

Input:
- Product Title: ${product}
- Product Image

Output:
- Price in USD (positive number).`,
};

export const generateProductCategories = {
  model: AI_MODELS.QWEN,
  prompt: (product: string, categories: ICategoryName[]) =>
    `You are an AI categorizer. Based on the given product title, generate a list of relevant category IDs (as comma-separated values). Use the provided category list with IDs and names to find the best matching categories for the product. Return only the category IDs as a comma-separated string without any additional text.

Categories: ${categories
      .map((category) => `${category.id}: ${category.name}`)
      .join(", ")}

Input:
- Product Title: ${product}

Output:
- Comma-separated list of category IDs (e.g., "1,2,5").`,
};

export const generateProductImage = {
  model: AI_MODELS.GEMINI,
  prompt: (product: string) =>
    `You are an AI image generator. Based on the given product title and image, generate a beautiful, SEO-optimized image that clearly represents the product. The image should focus solely on the product, with no extra details or distractions. Ensure the product in the generated image completely matches the item shown in the input image. The image should be clean, professional, and visually appealing, suitable for e-commerce or online product listings.

Input:
- Product Title: ${product}
- Product Image: 

Output:
- A clean, detailed, and accurate image of the product that fully corresponds to the input.`,
};
