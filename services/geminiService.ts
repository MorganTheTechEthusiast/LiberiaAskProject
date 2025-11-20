
import { GoogleGenAI, Tool, Content, Modality } from "@google/genai";
import { SearchResult, SearchSource, Language } from "../types";

// For Vercel/Vite production, use import.meta.env.VITE_API_KEY
// For Local/Playground, use process.env.API_KEY
const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

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

export const searchLiberia = async (query: string, county: string = 'All Liberia', language: Language = 'English'): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Use Google Search Grounding
    const tools: Tool[] = [{ googleSearch: {} }];

    let instructions = LIBERIA_SYSTEM_INSTRUCTION;
    let contextQuery = query;

    // Apply County Context
    if (county && county !== 'All Liberia') {
        contextQuery += ` (Context: Focus strictly on information related to ${county} County, Liberia)`;
    }

    // Apply Language Context
    if (language === 'Koloqua') {
        instructions += `\nIMPORTANT STYLE GUIDE: The user has selected "Koloqua". 
        You must write your response in Koloqua to sound authentic and local. 
        Use phrases like "da true", "my people", "jor", "pekin", but ensure the factual information remains accurate and readable.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: contextQuery,
      config: {
        tools,
        systemInstruction: instructions,
        temperature: 0.3, // Keep it factual
      }
    });

    const text = response.text || "No information found.";
    
    // Extract grounding chunks (sources)
    const sources: SearchSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // Dedup sources
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      text,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "An error occurred while searching the Liberia Knowledge Base. Please try again.",
      sources: []
    };
  }
};

export const chatWithLiberiaAI = async (history: Content[], message: string, language: Language = 'English') => {
    let instruction = LIBERIA_SYSTEM_INSTRUCTION + " You are acting as a helpful chat assistant.";
    
    if (language === 'Koloqua') {
        instruction += `
        IMPORTANT: You are now speaking in Koloqua.
        - Use authentic Koloqua vocabulary and grammar (e.g., "da", "na", "jor", "pekin", "my people", "wait small", "hold it").
        - Tone: Warm, welcoming, and respectful, like a friendly Liberian guide explaining things to a brother or sister.
        - Start responses with typical Koloqua greetings if appropriate (e.g., "My people, I here for y'all" or "Chief, let me tell you").
        - Even though you are speaking Koloqua, ensure all facts, dates, and names are 100% accurate.
        - Do not revert to standard American English unless explaining a complex technical term, then explain it in Koloqua.
        `;
    } else {
        instruction += " Speak in standard, professional English.";
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: instruction,
            tools: [{ googleSearch: {} }]
        },
        history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text;
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    // Truncate text to avoid excessive generation for the demo
    const cleanText = text.slice(0, 2000); 

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
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
    console.error("TTS generation error:", error);
    return undefined;
  }
};