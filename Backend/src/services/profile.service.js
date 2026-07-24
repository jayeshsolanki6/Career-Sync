import { callAI } from './ai.service.js';

export const extractProfileFromResume = async (resumeText) => {
  const prompt = `You are an expert career counselor and resume analyst. Analyze the following resume and extract structured information.

RESUME:
${resumeText}

Return ONLY valid JSON with this exact structure (no markdown, no code fences, no extra text):
{
  "skills": ["skill1", "skill2", "skill3"],
  "experienceSummary": "2-3 sentence summary of the candidate's professional background and expertise",
  "targetRoles": ["Role 1", "Role 2"],
  "resumeHealth": {
    "actionVerbScore": <number 0-100>,
    "actionVerbFeedback": "Specific, actionable feedback on the action verbs used in the resume. Mention strong examples and weak ones.",
    "readabilityScore": <number 0-100>,
    "readabilityFeedback": "Feedback on resume structure, formatting clarity, length, and overall readability."
  }
}

Rules:
- skills: Extract ALL technical skills, tools, frameworks, languages, and domain expertise clearly mentioned or implied. Return as a clean list of short skill names.
- experienceSummary: Summarize the candidate's career trajectory, domain, and key strengths in 2-3 sentences.
- targetRoles: Infer 2-4 most likely job titles this person is targeting based on their experience and skills.
- actionVerbScore: Rate 0-100 based on how well the resume uses strong action verbs (Led, Built, Architected, etc.) vs weak ones (Helped, Assisted, Was responsible for).
- readabilityScore: Rate 0-100 based on clarity, structure, appropriate length, and consistency.
- Return ONLY valid JSON.`;

  try {
    return await callAI(prompt);
  } catch (error) {
    throw new Error(`Profile extraction failed: ${error.message}`);
  }
};
