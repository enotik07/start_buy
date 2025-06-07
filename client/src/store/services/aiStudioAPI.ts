import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AI_GOOGLE_KEY, AI_GOOGLE_URL } from "../../helpers/config";
import { ImageGenerationResponse } from "../../models/aiChat";

const aiStudioAPI = createApi({
  reducerPath: "aiStudioAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: AI_GOOGLE_URL,
  }),
  endpoints: (builder) => ({
    generateImage: builder.mutation<ImageGenerationResponse, {mime_type: string, imageBase64: string; text: string }>({
      query: ({ mime_type, imageBase64, text }) => ({
        url: `?key=${AI_GOOGLE_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text },
                {
                  inline_data: {
                    mime_type: mime_type,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: { responseModalities: ['Text', 'Image'] },
        }),
      }),
    }),
  }),
});

export default aiStudioAPI;
export const { useGenerateImageMutation } = aiStudioAPI;
