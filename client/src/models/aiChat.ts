export interface ImageUrl {
  url: string;
}

export interface ContentItem {
  type: "text" | "image_url";
  text?: string;
  image_url?: ImageUrl;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: ContentItem[] | string;
}

export interface ChatRequest {
  model: string;
  messages: Message[];
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  choices: Array<{ message: Message; finish_reason: string }>;
}

export interface ImageRequestData {
  contents: Array<{
    parts: Array<{
      text: string;
      inline_data: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
  generationConfig: {
    responseModalities: string[];
  };
}

// export interface ImageGenerationResponse {
//   data: string;
// }

export interface ImageGenerationResponse {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
}

interface Candidate {
  content: Content;
  finishReason: string;
  index: number;
}

interface Content {
  parts: Part[];
  role: string;
}

interface Part {
  inlineData: InlineData;
}

interface InlineData {
  mimeType: string;
  data: string;
}

interface UsageMetadata {
  promptTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: PromptTokensDetail[];
}

interface PromptTokensDetail {
  modality: string;
  tokenCount: number;
}
