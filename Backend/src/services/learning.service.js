import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

export const generateLearningRoadmap = async (skillName) => {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const prompt = `You are a strict career AI. Create a 7-day plan to learn ${skillName}. Focus on applying this to a resume project.
Provide your analysis in the following strict JSON format (return ONLY valid JSON, no markdown or extra text):
{
  "plan": [
    {
      "day": "Day 1",
      "title": "Short title of the day",
      "focus": "Main focus/concept",
      "tasks": ["Task 1", "Task 2"]
    }
    // ... up to Day 7
  ],
  "projectIdea": "A short description of a project to build."
}
Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Return only the raw JSON string.`;

    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: prompt,
    });

    // Parse to ensure validity, then stringify to save as string in DB for simplicity
    const parsedResponse = JSON.parse(response.output_text);
    return JSON.stringify(parsedResponse);
  } catch (error) {
    throw new Error(`Roadmap generation failed: ${error.message}`);
  }
};
