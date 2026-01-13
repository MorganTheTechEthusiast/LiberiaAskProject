
import { GoogleGenAI, Tool, Content, Modality, GenerateContentResponse } from "@google/genai";
import { SearchResult, SearchSource, Language } from "../types";

const LIBERIA_SYSTEM_INSTRUCTION = `
You are "AskLiberia", a specialized national search engine and knowledge base for the Republic of Liberia.
Your goal is to provide accurate, comprehensive, and reliable information about Liberia, including:
- History (Presidents, establishment, conflicts, progress)
- Culture (Tribes, languages, food, traditions, arts)
- Tourism (Landmarks, nature, hotels, travel guides)
- Government (Constitution, ministries, current events, laws)
- Economy (Agriculture, mining, business statistics)
- People (Notable figures, demographics)

Guidelines:
1. If a user asks about a non-Liberian topic (unless it relates to Liberia), politely redirect them to Liberian topics or try to find a connection to Liberia.
2. Use the Google Search tool to find the latest and most accurate information. Information about Liberia can be scattered, so synthesize it well.
3. Format your response in clean Markdown. Use headings, bullet points, and bold text for readability.
4. Be objective and educational.
5. Always include a section at the end suggesting 3 related follow-up searches about Liberia if possible.
`;

export const searchLiberia = async (
  query: string, 
  county: string = 'All Liberia', 
  language: Language = 'English',
  onStreamUpdate?: (data: { text: string, sources: SearchSource[] }) => void
): Promise<SearchResult> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // Check if the API key is actually there
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        console.error("DEBUG: API_KEY is missing from environment variables.");
        throw new Error("MISSING_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const tools: Tool[] = [{ googleSearch: {} }];

    let instructions = LIBERIA_SYSTEM_INSTRUCTION;
    if (county && county !== 'All Liberia') {
        instructions += `\nAdditional Context: Focus strictly on information related to ${county} County, Liberia.`;
    }

    if (language === 'Koloqua') {
        instructions += `\nIMPORTANT STYLE GUIDE: Write in Liberian Koloqua (English-based creole). Use local phrasing.`;
    }

    const responseStream = await ai.models.generateContentStream({
      model,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        tools,
        systemInstruction: instructions,
        temperature: 0.3,
      }
    });

    let fullText = '';
    const sourceMap = new Map<string, SearchSource>();

    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullText += chunk.text;
      }
      
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((c: any) => {
          if (c.web?.uri && c.web?.title) {
            sourceMap.set(c.web.uri, {
              title: c.web.title,
              uri: c.web.uri
            });
          }
        });
      }

      if (onStreamUpdate) {
        onStreamUpdate({
          text: fullText,
          sources: Array.from(sourceMap.values())
        });
      }
    }

    return {
      text: fullText || "I couldn't find specific details for that search.",
      sources: Array.from(sourceMap.values())
    };

  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    
    let userErrorMessage = "An error occurred while searching. Please try again later.";
    
    // Specific error handling for clarity
    if (error.message === "MISSING_API_KEY") {
        userErrorMessage = "Configuration Error: The API Key is not set in Vercel Environment Variables. Please follow the instructions in DEPLOYMENT.md.";
    } else if (error.message?.includes("403") || error.message?.includes("permission")) {
        userErrorMessage = "Access Denied: Your Gemini API key might not have permission to use 'Google Search' grounding. Ensure you are using a key from a project with billing enabled, or use a model that supports free grounding if available.";
    } else if (error.message?.includes("429")) {
        userErrorMessage = "Too many requests: You have reached the rate limit for the Gemini API. Please wait a moment.";
    }

    return {
      text: userErrorMessage,
      sources: []
    };
  }
};

export const chatWithLiberiaAI = async (
    history: Content[], 
    message: string, 
    language: Language = 'English',
    onStreamUpdate?: (text: string) => void
): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') return "API Key not configured in Vercel settings.";
    
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: LIBERIA_SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }]
        },
        history: history
    });

    try {
        const resultStream = await chat.sendMessageStream({ message });
        let fullText = '';
        for await (const chunk of resultStream) {
            if (chunk.text) {
                fullText += chunk.text;
                if (onStreamUpdate) onStreamUpdate(fullText);
            }
        }
        return fullText;
    } catch (error) {
        console.error("Chat Error", error);
        return "I'm having trouble connecting to the Liberian AI right now. Check your API settings.";
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') return undefined;
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.slice(0, 1500) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS error:", error);
    return undefined;
  }
};
