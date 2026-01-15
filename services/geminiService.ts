
import { GoogleGenAI, Tool, Content, Modality, GenerateContentResponse } from "@google/genai";
import { SearchResult, SearchSource, Language } from "../types";

const LIBERIA_SYSTEM_INSTRUCTION = `
You are "AskLiberia", the definitive national search engine for the Republic of Liberia.
Your goal is to provide a detailed, accurate answer to EVERY question about Liberia.
Guidelines:
1. Synthesize information clearly. 
2. Use clean, professional Markdown. 
3. If specific live data is unavailable, use your deep internal knowledge of Liberian history (Founding, 1847, Tubman era, etc.), culture (16 tribes, food, traditions), and geography (counties, cities) to provide the best possible answer.
4. NEVER show a technical error message or say you are busy. Just provide the answer.
`;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 2, backoff = 500): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      await delay(backoff);
      return withRetry(fn, retries - 1, backoff * 1.5);
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
  
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
      return { text: "System configuration error. Please contact support.", sources: [] };
  }
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  let instructions = LIBERIA_SYSTEM_INSTRUCTION;
  if (county && county !== 'All Liberia') instructions += `\nFocus context: ${county} County.`;
  if (language === 'Koloqua') instructions += `\nResponse Language: Liberian Koloqua.`;

  // --- Step 1: Attempt Grounded Search (Google Search) ---
  const executeGroundedSearch = async () => {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: instructions,
        temperature: 0.2,
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
      if (onStreamUpdate) onStreamUpdate({ text: fullText, sources: Array.from(sourceMap.values()) });
    }
    return { text: fullText, sources: Array.from(sourceMap.values()) };
  };

  // --- Step 2: Fallback to Internal Knowledge (No tools, higher limits) ---
  const executeInternalKnowledgeSearch = async () => {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: instructions + "\nIMPORTANT: Provide a full, detailed answer from your internal knowledge. Do not mention that you couldn't search the web.",
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return { text: response.text || "I have processed your request but could not generate a response. Please try a different query.", sources: [] };
  };

  try {
    // Try the search with a single retry if it's a rate limit
    return await withRetry(executeGroundedSearch, 1, 300);
  } catch (error) {
    console.warn("Search tool hit a limit, falling back to internal knowledge...");
    try {
      // If grounded search fails, use the internal model knowledge which has much higher limits
      return await executeInternalKnowledgeSearch();
    } catch (fallbackError) {
      return { 
        text: "I am having some difficulty reaching the knowledge base. Please rephrase your question or try again in a moment.", 
        sources: [] 
      };
    }
  }
};

export const chatWithLiberiaAI = async (
    history: Content[], 
    message: string, 
    language: Language = 'English',
    onStreamUpdate?: (text: string) => void
): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "Connection error.";
    const ai = new GoogleGenAI({ apiKey });
    
    const runChat = async (useTools: boolean) => {
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: LIBERIA_SYSTEM_INSTRUCTION,
                tools: useTools ? [{ googleSearch: {} }] : [],
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
        return await runChat(true);
    } catch (e) {
        // Silent fallback for chat too
        try {
            return await runChat(false);
        } catch (innerE) {
            return "I'm sorry, I'm having trouble responding right now. Please try again.";
        }
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return undefined;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.slice(0, 800) }] }],
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
