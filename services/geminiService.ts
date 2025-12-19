import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if key is present to avoid immediate crash,
// though functionality will be disabled without it.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please add an API_KEY to your environment variables.";
  }

  try {
    const prompt = `Write a luxurious, elegant, and sophisticated product description for a high-end fashion item named "${name}" in the category "${category}". The brand "Lara_n_Shen" is a Nigerian Luxury Brand. The tone should be exclusive, alluring, and celebrate African heritage, Lagos sophistication, and modern elegance. Keep it under 60 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Description unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};

export const getStylingAdvice = async (productName: string): Promise<string> => {
    if (!ai) return "Stylist currently unavailable.";

    try {
        const prompt = `Act as a world-class fashion stylist for the Nigerian luxury brand "Lara_n_Shen". Give a short, 2-sentence styling tip on how to wear the "${productName}" for a high-profile event in Lagos (like an Owambe or Gala). Suggest culturally relevant accessories (like beads, headgear) or pairings.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "No advice available.";
    } catch (e) {
        console.error(e);
        return "Stylist is busy.";
    }
}