
import { GoogleGenAI, Type } from "@google/genai";
import { HolidayGreeting } from "../types";

export const generateHolidayGreeting = async (prompt?: string): Promise<HolidayGreeting> => {
  // Fix: Initialize the client using import.meta.env.VITE_API_KEY for Vite projects.
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt || "Generate a heartwarming, sophisticated Christmas greeting for someone looking at a beautiful 3D digital tree.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          message: { type: Type.STRING },
          author: { type: Type.STRING }
        },
        required: ["title", "message", "author"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    return {
      title: "Merry Christmas",
      message: "May the warmth of the holiday season fill your heart with joy and peace.",
      author: "Gemini AI"
    };
  }
};
