
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseResume = async (fileText: string): Promise<ResumeData> => {
  const ai = getAI();
  
  const systemInstruction = `You are a world-class professional resume analyst and data engineer. 
  Your mission is to extract EVERY SINGLE DETAIL from the provided resume text without exception.
  
  STRICT RULES:
  1. ZERO OMISSION: Capture all company names, dates, locations, bullet points, certifications, and skills.
  2. NORMALIZATION: Format dates consistently (e.g., "MM/YYYY" or "Month YYYY").
  3. STRUCTURE: Organize the raw data into the specified JSON format.
  4. CLEANING: Remove artifacts from PDF/DOCX parsing but retain all meaningful content.
  5. LOGIC: If a role is "Present", ensure it's marked as such.
  6. EXHAUSTIVE EXTRACTION: If a resume has 20 bullet points, extract all 20. Do not summarize unless necessary to fit the field.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `EXTRACT AND NORMALIZE THE FOLLOWING RESUME TEXT INTO JSON.
    
    SOURCE TEXT:
    ---
    ${fileText}
    ---`,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              website: { type: Type.STRING }
            },
            required: ["name"]
          },
          summary: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                location: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "company", "role"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                institution: { type: Type.STRING },
                degree: { type: Type.STRING },
                field: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                location: { type: Type.STRING }
              },
              required: ["id", "institution"]
            }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          certifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                issuer: { type: Type.STRING },
                date: { type: Type.STRING }
              }
            }
          },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  try {
    const parsed = JSON.parse(response.text || '{}');
    if (parsed.experience) {
      parsed.experience = parsed.experience.map((e: any, i: number) => ({...e, id: e.id || `exp-${i}-${Date.now()}`}));
    }
    if (parsed.education) {
      parsed.education = parsed.education.map((e: any, i: number) => ({...e, id: e.id || `edu-${i}-${Date.now()}`}));
    }
    return parsed as ResumeData;
  } catch (e) {
    console.error("JSON parsing failed", e);
    throw new Error("Could not parse AI response.");
  }
};

export const improveWriting = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Improve the following resume text to be more professional, impactful, and results-oriented. Keep it concise. Return ONLY the improved text:\n\n${text}`
  });
  return response.text?.trim() || text;
};

export const recruiterReview = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a senior recruiter, provide 1-2 sentences of constructive feedback on the following resume experience. Is it specific? Does it show impact? Original text:\n\n${text}`
  });
  return response.text?.trim() || "No feedback available.";
};

export const generateTailoredSummary = async (experience: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following professional experience, write a compelling, 3-4 sentence professional summary for a resume. Highlight key strengths and overall trajectory. Return ONLY the summary:\n\n${experience}`
  });
  return response.text?.trim() || "";
};

export const customAIRequest = async (prompt: string, context: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Context: ${context}\n\nUser request: ${prompt}\n\nPlease respond appropriately to the request based on the context provided.`
  });
  return response.text?.trim() || "AI could not process the request.";
};
