
import { GoogleGenAI, Type } from "@google/genai";

// Per @google/genai guidelines, initialize the client directly with the API key from environment variables.
// It is assumed that `process.env.API_KEY` is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface DishSuggestion {
  dishName: string;
  description: string;
}

export const suggestDish = async (ingredients: string): Promise<DishSuggestion> => {
  // Per guidelines, API key is assumed to be present, so we can make the API call directly.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following ingredients, suggest a creative and appealing name and a short, enticing description for a new dish for a home kitchen menu. The ingredients are: ${ingredients}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: {
              type: Type.STRING,
              description: "The creative name for the dish."
            },
            description: {
              type: Type.STRING,
              description: "A short, enticing menu description for the dish."
            }
          }
        },
        temperature: 0.8,
      }
    });

    const jsonText = response.text.trim();
    const suggestion = JSON.parse(jsonText) as DishSuggestion;
    return suggestion;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      dishName: "Error",
      description: "Could not generate a suggestion. Please try again."
    };
  }
};