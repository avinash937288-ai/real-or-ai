
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Using the Flash model for maximum speed and lowest latency
const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeImageAuthenticity = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 data without prefix
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: `
          Perform a high-speed forensic scan on this image. 
          Determine if it is REAL or AI_GENERATED.
          
          Quickly identify:
          - Biological artifacts (eyes, hair, skin)
          - Geometric distortions
          - Lighting inconsistencies
          - Background coherence
          
          Return a JSON response with: verdict, confidence (0-100), reasoning (array), artifactsDetected (array), and a short summary.
          `
        }
      ],
    },
    config: {
      // Disabling thinking to minimize response time
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: {
            type: Type.STRING,
            description: "Must be 'REAL', 'AI_GENERATED', or 'INCONCLUSIVE'",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence percentage",
          },
          reasoning: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Brief visual observations",
          },
          artifactsDetected: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Technical anomalies found",
          },
          summary: {
            type: Type.STRING,
            description: "Short executive summary",
          }
        },
        required: ["verdict", "confidence", "reasoning", "artifactsDetected", "summary"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("Analysis failed.");
  
  try {
    return JSON.parse(resultText) as AnalysisResult;
  } catch (e) {
    console.error("Parse Error", resultText);
    throw new Error("Invalid forensic data.");
  }
};
