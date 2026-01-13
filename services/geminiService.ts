
import { GoogleGenAI, Tool, Content, Modality, GenerateContentResponse } from "@google/genai";
import { SearchResult, SearchSource, Language } from "../types";

const LIBERIA_SYSTEM_INSTRUCTION = `
You are "AskLiberia", a high-speed search engine for the Republic of Liberia.
Synthesize information from Google Search into a clear, concise Markdown response.
Be direct. Focus on accuracy and speed.
If the query is about history, mention key dates. If about places, mention current status.
`;

// Helper for Exponential Backoff (Handles 429 errors)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error.message?.includes("429") || error.status === 429;
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limited. Retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return withRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const searchLiberia = async (
  query: string, 
  county: string = 'All Liberia', 
  language: Language = 'English',
  onStreamUpdate?: (data: { text: string, sources: SearchSource[] }) => void
): Promise<SearchResult> => {
  const runSearch = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') throw new Error("MISSING_API_KEY");

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const tools: Tool[] = [{ googleSearch: {} }];

    let instructions = LIBERIA_SYSTEM_INSTRUCTION;
    if (county && county !== 'All Liberia') instructions += `\nFocus context: ${county} County.`;
    if (language === 'Koloqua') instructions += `\nResponse Language: Liberian Koloqua.`;

    const responseStream = await ai.models.generateContentStream({
      model,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        tools,
        systemInstruction: instructions,
        temperature: 0.1, // Lower temperature for more stable/faster results
        thinkingConfig: { thinkingBudget: 0 }
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
            sourceMap.set(c.web.uri, { title: c.web.title, uri: c.web.uri });
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
      text: fullText || "No content generated.",
      sources: Array.from(sourceMap.values())
    };
  };

  try {
    return await withRetry(runSearch);
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    let msg = "An error occurred while searching. Please try again.";
    
    if (error.message?.includes("429")) {
      msg = "The Knowledge Base is very busy right now (Rate Limit). Please wait 10 seconds and try your search again.";
    } else if (error.message === "MISSING_API_KEY") {
      msg = "Configuration Error: API Key missing in Vercel settings.";
    }

    return { text: msg, sources: [] };
  }
};

export const chatWithLiberiaAI = async (
    history: Content[], 
    message: string, 
    language: Language = 'English',
    onStreamUpdate?: (text: string) => void
): Promise<string> => {
    const runChat = async () => {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return "API Key missing.";
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: LIBERIA_SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 0 }
            },
            history: history
        });

        const resultStream = await chat.sendMessageStream({ message });
        let fullText = '';
        for await (const chunk of resultStream) {
            if (chunk.text) {
                fullText += chunk.text;
                if (onStreamUpdate) onStreamUpdate(fullText);
            }
        }
        return fullText;
    };

    try {
        return await withRetry(runChat);
    } catch (e) {
        return "Service is currently over capacity. Please wait a moment.";
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return undefined;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.slice(0, 800) }] }], // Reduced length for faster TTS
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
    return undefined;
  }
};
