import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

export const callAI = async (prompt) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const response = await client.responses.create({
    model: 'openai/gpt-oss-120b',
    input: prompt,
  });

  const responseText = response.output_text?.trim() || '';
  if (!responseText) {
    throw new Error('Received empty response from AI service.');
  }

  // Remove markdown code blocks if the model accidentally wraps output
  const cleanedText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    throw new Error(`Failed to parse AI JSON response: ${error.message}`);
  }
};
