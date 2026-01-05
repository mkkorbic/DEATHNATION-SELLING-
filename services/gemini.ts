
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getShoppingAdvice = async (query: string, products: Product[]) => {
  const productContext = products.map(p => 
    `- ${p.name}: ${p.description} (Price: ${p.currency} ${p.basePrice})`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User query: ${query}\n\nAvailable Products:\n${productContext}`,
      config: {
        systemInstruction: "You are a helpful and edgy shopping assistant for 'Death Nation', a streetwear brand. Your tone is cool, direct, and slightly gothic. Recommend specific products from the list provided. Keep answers concise."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "The void swallowed my response. Try again later.";
  }
};
