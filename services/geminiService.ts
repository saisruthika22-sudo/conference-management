import { GoogleGenerativeAI } from "@google/generative-ai";
import { Paper, ConferenceSession } from '../types';

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment");
    return null;
  }
  return new GoogleGenerativeAI({ apiKey });
};

export const improveAbstract = async (currentAbstract: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return currentAbstract;
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(`You are an expert academic editor. Rewrite the following research paper abstract to be more concise, professional, and impactful. Maintain the original meaning but improve clarity and flow.
    
Abstract: "${currentAbstract}"
    
Return ONLY the improved abstract text.`);
    return response.response.text()?.trim() || currentAbstract;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating improvement. Please try again.";
  }
};

export const generateReviewDraft = async (paperTitle: string, abstract: string): Promise<{ comments: string; pros: string[]; cons: string[] }> => {
  const ai = getAiClient();
  if (!ai) return { comments: '', pros: [], cons: [] };
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Act as a senior conference reviewer. Analyze the following paper abstract and provide a preliminary review structure.
      
Title: ${paperTitle}
Abstract: ${abstract}
      
Provide:
1. A summary paragraph (comments).
2. A list of 3 potential strengths (pros).
3. A list of 3 potential weaknesses or questions (cons).
      
Return the result in valid JSON format with keys: "comments", "pros" (array of strings), "cons" (array of strings). Do not use markdown code blocks.`
        }]
      }]
    });
    const text = response.response.text()?.trim() || "{}";
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
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(`I have the following research papers: ${papers.join(', ')}. 
Suggest a creative name for a conference session that could contain these papers. Return ONLY the session name.`);
    return response.response.text()?.trim() || "General Session";
  } catch (error) {
    return "General Session";
  }
};

export const chatWithAssistant = async (message: string, context: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI unavailable.";
  
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(`Context: You are a helpful assistant for a conference management platform.
User's Context: ${context}

User Question: ${message}

Answer concisely and helpfully.`);
    return response.response.text() || "I didn't get a response.";
  } catch(e) {
    console.error(e);
    return "I'm having trouble connecting right now.";
  }
};

export interface ScheduleAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const analyzeConferenceSchedule = async (sessions: ConferenceSession[], papers: Paper[]): Promise<ScheduleAnalysis | null> => {
  const ai = getAiClient();
  if (!ai) return null;
  
  const scheduleContext = sessions.map(s => {
    const sessionPapers = s.paperIds.map((pid) => papers.find((p) => p.id === pid)?.title || 'Unknown').join('; ');
    return `Session: ${s.title}, Time: ${s.startTime}-${s.endTime}, Room: ${s.room}, Papers: [${sessionPapers}]`;
  }).join('\n');
  
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(`Analyze this conference schedule for thematic consistency, timing conflicts, and topic balance.

Schedule Data:
${scheduleContext}

Return a valid JSON object with:
- "score": number (0-100 overall quality score)
- "strengths": array of strings (what works well)
- "weaknesses": array of strings (potential clashes or issues)
- "suggestions": array of strings (actionable improvements)

Do not format as markdown. Return raw JSON.`);
    const text = response.response.text()?.trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
};
