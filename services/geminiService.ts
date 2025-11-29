import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const improveAbstract = async (currentAbstract: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return currentAbstract;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert academic editor. Rewrite the following research paper abstract to be more concise, professional, and impactful. Maintain the original meaning but improve clarity and flow. 
      
      Abstract: "${currentAbstract}"
      
      Return ONLY the improved abstract text.`,
    });
    return response.text?.trim() || currentAbstract;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating improvement. Please try again.";
  }
};

export const generateReviewDraft = async (paperTitle: string, abstract: string): Promise<{ comments: string; pros: string[]; cons: string[] }> => {
  const ai = getAiClient();
  if (!ai) return { comments: '', pros: [], cons: [] };

  try {
    // We want a JSON response
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a senior conference reviewer. Analyze the following paper abstract and provide a preliminary review structure.
      
      Title: ${paperTitle}
      Abstract: ${abstract}
      
      Provide:
      1. A summary paragraph (comments).
      2. A list of 3 potential strengths (pros).
      3. A list of 3 potential weaknesses or questions (cons).
      
      Return the result in valid JSON format with keys: "comments", "pros" (array of strings), "cons" (array of strings). Do not use markdown code blocks.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text?.trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      comments: "Failed to generate review draft.", 
      pros: ["Error"], 
      cons: ["Error"] 
    };
  }
};

export const suggestSchedule = async (papers: string[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I have the following research papers: ${papers.join(', ')}. 
      Suggest a creative name for a conference session that could contain these papers. Return ONLY the session name.`,
    });
    return response.text?.trim() || "General Session";
  } catch (error) {
    return "General Session";
  }
};

export const chatWithAssistant = async (message: string, context: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI unavailable.";
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Context: You are a helpful assistant for a conference management platform.
        User's Context: ${context}
        
        User Question: ${message}
        
        Answer concisely and helpfully.`,
    });
    return response.text || "I didn't get a response.";
  } catch(e) {
      console.error(e);
      return "I'm having trouble connecting right now.";
  }
}

export interface ScheduleAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const analyzeConferenceSchedule = async (sessions: any[], papers: any[]): Promise<ScheduleAnalysis | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  // Prepare data context
  const scheduleContext = sessions.map(s => {
    const sessionPapers = s.paperIds.map((pid: string) => papers.find((p: any) => p.id === pid)?.title || 'Unknown').join('; ');
    return `Session: ${s.title}, Time: ${s.startTime}-${s.endTime}, Room: ${s.room}, Papers: [${sessionPapers}]`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this conference schedule for thematic consistency, timing conflicts, and topic balance.
      
      Schedule Data:
      ${scheduleContext}
      
      Return a valid JSON object with:
      - "score": number (0-100 overall quality score)
      - "strengths": array of strings (what works well)
      - "weaknesses": array of strings (potential clashes or issues)
      - "suggestions": array of strings (actionable improvements)
      
      Do not format as markdown. Return raw JSON.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text?.trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
};