
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const summarizeContent = async (text: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Please provide a concise summary of the following notes. detailed but brief: \n\n${text}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const elaborateTopic = async (topic: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Explain the following concept in detail, formatted as a clear study note with bullet points: ${topic}`,
    });
    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const chatWithAI = async (message: string, context: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Context: You are a helpful study assistant inside a note-taking app.
      
      User's current notes content:
      "${context.substring(0, 5000)}"
      
      User Question: ${message}`,
    });
    return response.text || "No response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const generateMeetingTemplate = async (topic: string): Promise<{ title: string; agenda: string[]; attendees: string[] }> => {
    if (!apiKey) {
        // Fallback if no API key
        return {
            title: topic || "Weekly Sync",
            agenda: ["Review progress", "Discuss blockers", "Action items"],
            attendees: ["Start typing..."]
        };
    }
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Generate a meeting note template for a meeting about "${topic}". 
            Return ONLY a JSON object with this structure: 
            { "title": "Meeting Title", "agenda": ["Item 1", "Item 2"], "attendees": ["Role 1", "Role 2"] }
            Do not use Markdown formatting.`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if(text) return JSON.parse(text);
        throw new Error("Empty response");
    } catch (e) {
        console.error(e);
        return {
            title: topic || "Meeting",
            agenda: ["Topic 1", "Topic 2"],
            attendees: []
        };
    }
}

export const recognizeHandwriting = async (base64Image: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key missing");
    try {
        // Strip data prefix if present for clean base64
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: cleanBase64
                        }
                    },
                    {
                        text: "Transcribe the handwritten text from this note page. Ignore the paper background lines, grids, or patterns. Return ONLY the transcribed text. If there is no handwriting, return an empty string."
                    }
                ]
            }
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Gemini Handwriting OCR Error:", error);
        return "";
    }
};
