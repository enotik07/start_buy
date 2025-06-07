import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AI_KEY, AI_URL } from "../../helpers/config";
import {
  ChatResponse,
  ContentItem,
} from "../../models/aiChat";
import { AI_MODELS } from "../../helpers/aiConfig";

const aiAPI = createApi({
  reducerPath: "aiAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: AI_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${AI_KEY}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (build) => ({
    chat: build.mutation<
      ChatResponse,
      { content: ContentItem[]; model: AI_MODELS }
    >({
      query: ({ content, model }) => ({
        url: "chat/completions",
        method: "POST",
        body: {
          model: model,
          messages: [
            {
              role: "user",
              content: content,
            },
          ],
        },
      }),
    }),
  }),
});

export default aiAPI;
export const { useChatMutation } = aiAPI;
