import { GoogleGenAI } from "@google/genai";
import type { ImageConfig } from "@google/genai";

export default function() {
  const runtimeConfig = useRuntimeConfig()
  const ai = new GoogleGenAI({
    apiKey: runtimeConfig.gemini.apiKey || process.env.GEMINI_API_KEY
  });

  const imageModelId = runtimeConfig.gemini.imageModelId || process.env.GEMINI_IMAGE_MODEL_ID || "gemini-2.5-flash-image";
  const textModelId = runtimeConfig.gemini.textModelId || process.env.GEMINI_TEXT_MODEL_ID || "gemini-2.5-flash";

  return {
    async generateText(prompt: string): Promise<string> {
      const response = await ai.models.generateContent({
        model: textModelId,
        contents: prompt
      });

      if (!response || !response.text) {
        throw new Error("No text generated");
      }

      return response.text;
    },
    async generateJson<T>(prompt: string, schema: any): Promise<T> {
      const response = await ai.models.generateContent({
        model: textModelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      if (!response || !response.text) {
        throw new Error("No text generated");
      }

      return JSON.parse(response.text) as T;
    },
    async generateImage(prompt: string, config?: ImageConfig): Promise<Buffer> {
      const response = await ai.models.generateContent({
        model: imageModelId,
        contents: prompt,
        config: {
          imageConfig: config
        }
      });
    
      if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
        throw new Error("No image generated");
      }

      const inlineData = response.candidates[0].content.parts.find(part => part.inlineData && part.inlineData.data);
      if (!inlineData || !inlineData.inlineData || !inlineData.inlineData.data) {
        console.log("Response candidates:", response.candidates);
        throw new Error("No image data found");
      }

      const buffer = Buffer.from(inlineData.inlineData.data, "base64");
      return buffer;
    }
  }
}
