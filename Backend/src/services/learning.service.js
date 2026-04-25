import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

export const generateLearningRoadmap = async (skillName, context = {}) => {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { currentSkills = [], targetRole = 'Software Engineer' } = context;

    const skillsContext = currentSkills.length > 0
      ? `The learner already knows: ${currentSkills.join(', ')}. Build on these where relevant.`
      : '';

    const prompt = `You are an expert career coach and technical curriculum designer.

USER PROFILE:
- Target Role: ${targetRole}
- Skill Being Learned: ${skillName}
- Reason: This skill was identified as a gap for their target role.
${skillsContext}

TASK:
Create a focused, actionable 7-day learning plan for "${skillName}" that:
1. Starts from where the user currently is (considering their existing skills).
2. Provides a day-wise list of specific topics and concepts to cover.
3. DO NOT recommend specific videos, courses, or "watch X minutes" tasks. Focus purely on WHAT to learn (the concepts, techniques, and practical applications).
4. Each day should have 2-4 concrete, actionable topic-based tasks (e.g., "Understand the virtual DOM and component lifecycle", "Build a simple counter using useState").
5. Day 7 ends with a portfolio-ready mini-project they can add to their resume for a ${targetRole} role.
6. Keep topics realistic and completable within 2-3 hours per day.

Return ONLY valid JSON with no markdown, no code fences, no extra text:
{
  "plan": [
    {
      "day": "Day 1",
      "title": "Short, specific title",
      "focus": "The one main concept or skill for this day",
      "tasks": ["Specific topic to cover 1", "Specific topic to cover 2"]
    }
  ],
  "projectIdea": "A specific, concrete portfolio project with a clear description of what they will build and how it demonstrates ${skillName} for a ${targetRole} role."
}`;

    // Custom API call matching analysis.service.js
    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: prompt,
    });

    const outputText = response.output_text;
    const parsedResponse = JSON.parse(outputText);
    return JSON.stringify(parsedResponse);
  } catch (error) {
    throw new Error(`Roadmap generation failed: ${error.message}`);
  }
};
