
import { GoogleGenAI, Tool, Content, Modality, GenerateContentResponse } from "@google/genai";
import { SearchResult, SearchSource, Language } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    // Using gemini-3-flash-preview as recommended for basic/search tasks
    const model = 'gemini-3-flash-preview';
    
    const tools: Tool[] = [{ googleSearch: {} }];

    let instructions = LIBERIA_SYSTEM_INSTRUCTION;
    let contextQuery = query;

    if (county && county !== 'All Liberia') {
        contextQuery += ` (Context: Focus strictly on information related to ${county} County, Liberia)`;
    }

    if (language === 'Koloqua') {
        instructions += `\nIMPORTANT STYLE GUIDE: The user has selected "Koloqua". 
        You must write your response in Koloqua to sound authentic and local. 
        Use phrases like "da true", "my people", "jor", "pekin", but ensure the factual information remains accurate and readable.`;
    }

    const responseStream = await ai.models.generateContentStream({
      model,
      contents: contextQuery,
      config: {
        tools,
        systemInstruction: instructions,
        temperature: 0.3,
      }
    });

    let fullText = '';
    const sourceMap = new Map<string, SearchSource>();

    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      const chunkText = c.text;
      
      // Extract grounding sources from the response metadata
      const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            sourceMap.set(chunk.web.uri, {
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        });
      }

      if (chunkText) {
        fullText += chunkText;
        if (onStreamUpdate) {
          onStreamUpdate({
            text: fullText,
            sources: Array.from(sourceMap.values())
          });
        }
      }
    }

    return {
      text: fullText || "No information found.",
      sources: Array.from(sourceMap.values())
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "An error occurred while searching the Liberia Knowledge Base. Please try again.",
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
    let instruction = LIBERIA_SYSTEM_INSTRUCTION + " You are acting as a helpful chat assistant.";
    
    if (language === 'Koloqua') {
        instruction += `
        IMPORTANT: You are now speaking in Koloqua.
        - Use authentic Koloqua vocabulary and grammar.
        - Tone: Warm, welcoming, and respectful.
        - Start responses with typical Koloqua greetings if appropriate.
        - Even though you are speaking Koloqua, ensure all facts, dates, and names are 100% accurate.
        `;
    }

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: instruction,
            tools: [{ googleSearch: {} }]
        },
        history: history
    });

    try {
        const resultStream = await chat.sendMessageStream({ message });
        
        let fullText = '';
        for await (const chunk of resultStream) {
            const c = chunk as GenerateContentResponse;
            const text = c.text;
            if (text) {
                fullText += text;
                if (onStreamUpdate) {
                    onStreamUpdate(fullText);
                }
            }
        }
        return fullText;
    } catch (error) {
        console.error("Chat Error", error);
        return "I'm having trouble connecting right now.";
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
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
    console.error("TTS generation error:", error);
    return undefined;
  }
};
