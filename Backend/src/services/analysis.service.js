import { GoogleGenAI } from '@google/genai';
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

export const analyzeResumeAndJd = async (resumeText, jdText) => {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: analysisPrompt(resumeText, jdText),
    });

    const responseText = response.output_text;
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse;
  } catch (error) {
    throw new Error(`Groq analysis failed: ${error.message}`);
  }
};

// export const analyzeResumeAndJd = async (resumeText, jdText) => {
//   try {
//     const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

//     const response = await ai.models.generateContent({
//       model: 'gemini-3.1-flash-lite-preview',
//       // model: 'gemini-3-flash-preview',
//       contents: analysisPrompt(resumeText, jdText),
//     });

//     const responseText = response.text;
//     const parsedResponse = JSON.parse(responseText);

//     return parsedResponse;
//   } catch (error) {
//     throw new Error(`Gemini analysis failed: ${error.message}`);
//   }
// };



const analysisPrompt = (resumeText, jdText) => `
You are an expert career advisor and resume analyst. Analyze the following resume against the job description and provide a structured JSON response.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Provide your analysis in the following JSON format (return ONLY valid JSON, no markdown or extra text):
{
  "shortSummary": "A 2-3 sentence summary of how well the resume matches the job",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "requiredSkills": ["skill1", "skill2"],
  "importantMissingSkillsToLearn": ["skill1", "skill2"],
  "resumeTailoringsuggestions": [
    "specific suggestion for tailoring resume"
  ],
  "requiredExperience": {
    "years": <number>,
    "details": "description of required experience"
  },
  "currentExperience": {
    "years": <number>,
    "details": "summary of detected experience from resume"
  }
}

Rules:
- matchingSkills: Skills present in BOTH resume and JD. Map synonymous skills (e.g., "Node", "Node.js", "NodeJS" or "React", "React.js") to a single standard name and count it as a match if present in both.
- missingSkills: Skills in JD but NOT in resume. (Account for synonymous skills as above).
- requiredSkills: All skills mentioned in JD. Unify variations of the same skill.
- importantMissingSkillsToLearn: A subset of missingSkills. The most critical skills from 'missingSkills' that the candidate must absolutely learn to be qualified for this job. Recommend 3-5 high priority skills.
- resumeTailoringsuggestions: Actionable ways to improve resume for this role
- requiredExperience: Extract from JD
- currentExperience: Extract from resume
- Return ONLY valid JSON, no markdown formatting like \`\`\`json \`\`\`, no extra text
- Only extract skills that are EXPLICITLY written or semantically equivalent in the resume text
- Do NOT infer, assume, or guess unrelated skills
`;

