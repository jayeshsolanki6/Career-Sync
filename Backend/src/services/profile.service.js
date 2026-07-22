import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Calls the LLM to extract structured profile data AND perform a baseline
 * resume health analysis from resume text alone (no JD needed).
 *
 * @param {string} resumeText - Raw text extracted from the uploaded resume.
 * @returns {Promise<Object>} - Parsed structured profile + health data.
 */
export const extractProfileFromResume = async (resumeText) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const prompt = `You are an expert career counselor and resume analyst. Analyze the following resume and extract structured information.

RESUME:
${resumeText}

Return ONLY valid JSON with this exact structure (no markdown, no code fences, no extra text):
{
  "skills": ["skill1", "skill2", "skill3"],
  "experienceYears": <number>,
  "experienceSummary": "2-3 sentence summary of the candidate's professional background and expertise",
  "targetRoles": ["Role 1", "Role 2"],
  "resumeHealth": {
    "actionVerbScore": <number 0-100>,
    "actionVerbFeedback": "Specific, actionable feedback on the action verbs used in the resume. Mention strong examples and weak ones.",
    "readabilityScore": <number 0-100>,
    "readabilityFeedback": "Feedback on resume structure, formatting clarity, length, and overall readability.",
    "improvementSuggestions": [
      "Specific actionable suggestion 1",
      "Specific actionable suggestion 2",
      "Specific actionable suggestion 3",
      "Specific actionable suggestion 4",
      "Specific actionable suggestion 5"
    ],
    "phraseImprovements": [
      {
        "originalPhrase": "Responsible for managing team",
        "improvedPhrase": "Directed a cross-functional team of 10 engineers to deliver projects 20% faster",
        "reason": "Replaces weak 'responsible for' with strong action verb 'Directed' and adds quantifiable impact."
      }
    ]
  }
}

Rules:
- skills: Extract ALL technical skills, tools, frameworks, languages, and domain expertise clearly mentioned or implied. Return as a clean list of short skill names.
- experienceYears: Count ONLY professional work experience (full-time, part-time, internship, freelance). Exclude academic projects and coursework. If none, return 0.
- experienceSummary: Summarize the candidate's career trajectory, domain, and key strengths in 2-3 sentences.
- targetRoles: Infer 2-4 most likely job titles this person is targeting based on their experience and skills.
- actionVerbScore: Rate 0-100 based on how well the resume uses strong action verbs (Led, Built, Architected, etc.) vs weak ones (Helped, Assisted, Was responsible for).
- readabilityScore: Rate 0-100 based on clarity, structure, appropriate length, and consistency.
- improvementSuggestions: Give exactly 4-6 concrete, high-impact suggestions to improve the resume.
- phraseImprovements: Find exactly 3 weak or passive bullet points/phrases from the resume, and provide a tailored, highly impactful rewrite for each, along with a brief reason.
- Return ONLY valid JSON.`;

  const response = await client.responses.create({
    model: 'openai/gpt-oss-120b',
    input: prompt,
  });

  const text = response.output_text?.trim();
  if (!text) throw new Error('Empty response from AI profile extraction.');

  try {
    return JSON.parse(text);
  } catch {
    // Try stripping accidental markdown fences
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  }
};
