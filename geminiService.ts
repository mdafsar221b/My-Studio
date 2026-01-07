
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseResume = async (base64Data: string, mimeType: string): Promise<ResumeData> => {
  const ai = getAI();

  const systemInstruction = `You are a world-class professional resume analyst and data engineer. 
  Your mission is to extract EVERY SINGLE DETAIL from the provided resume document image/file verbatim.
  
  STRICT RULES:
  1. EXHAUSTIVE EXTRACTION: Do not summarize. If the user lists 10 bullet points, you MUST extract all 10 exactly as written.
  2. DATA PRESERVATION: Capture every single skill, technology, tool, and certification mentioned.
  3. STRUCTURE: Organize the data strictly into the JSON schema provided.
  4. NORMALIZATION: Standardize date formats to "MM/YYYY" or "Month YYYY".
  5. HANDLING GAPS: If a field is missing, leave it as an empty string or empty array. Do not hallucinate data.
  6. RICH CONTENT: Ensure descriptions are captured in full richness, preserving technical terms and metrics.
  7. VISUAL CONTEXT: Use the layout to distinguish between sections (e.g., sidebars vs main content).`;

  console.log("--- STARTING RESUME PARSING ---");
  console.log("MIME Type:", mimeType);
  console.log("Data Length:", base64Data.length);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "EXTRACT THE FOLLOWING RESUME DOCUMENT INTO JSON WITH 100% FIDELITY. CAPTURE ALL TEXT VISIBLE."
          },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      maxOutputTokens: 10000, 
      temperature: 0.1, 
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
    const responseText = response.text || '{}';
    console.log("--- RAW AI RESPONSE ---");
    console.log(responseText.substring(0, 500) + "..."); 

    const parsed = JSON.parse(responseText);

    console.log("--- PARSED DATA OBJECT ---");
    console.log(JSON.stringify(parsed, null, 2));

    // Ensure all arrays exist
    parsed.experience = parsed.experience || [];
    parsed.education = parsed.education || [];
    parsed.skills = parsed.skills || [];
    parsed.certifications = parsed.certifications || [];
    parsed.achievements = parsed.achievements || [];
    parsed.sections = parsed.sections || [];

    // Add IDs to experience/education if missing
    parsed.experience = parsed.experience.map((e: any, i: number) => ({ ...e, id: e.id || `exp-${i}-${Date.now()}` }));
    parsed.education = parsed.education.map((e: any, i: number) => ({ ...e, id: e.id || `edu-${i}-${Date.now()}` }));

    // Inject default layout for existing sections
    parsed.layout = {
      pages: [{
        left: ['experience', 'education'],
        right: ['summary', 'achievements', 'skills', 'certifications']
      }]
    };

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
