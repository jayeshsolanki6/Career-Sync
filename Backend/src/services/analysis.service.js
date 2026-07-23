import { callAI } from './ai.service.js';

export const analyzeResumeAndJd = async (resumeText, jdText) => {
  try {
    return await callAI(analysisPrompt(resumeText, jdText));
  } catch (error) {
    throw new Error(`Groq analysis failed: ${error.message}`);
  }
};


const analysisPrompt = (resumeText, jdText) => `
You are an expert career advisor and resume/ATS analyst. Analyze the following resume against the job description and return ONLY a single valid JSON object — no markdown, no code fences, no preamble, no extra text.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Provide your analysis in exactly this JSON format (same keys, same nesting, same types — do not add or remove fields):
{
  "targetRole": "The extracted targeted job role or title from the JD",
  "shortSummary": "A 2-3 sentence summary of how well the resume matches the job",
  "score": {
    "overall": 72,
    "breakdown": {
      "skillMatch": {
        "score": 70,
        "description": "Brief note on skill coverage"
      },
      "experienceAlignment": {
        "score": 80,
        "description": "Brief note comparing current vs required experience"
      }
    }
  },
  "atsKeywords": ["keyword1", "keyword2"],
  "matchingSkills": ["React", "Git"],
  "missingSkills": ["Kubernetes", "GraphQL"],
  "importantMissingSkillsToLearn": ["skill1", "skill2"],
  "phraseImprovementSuggestions": [
    {
      "weakPhrase": "A weak resume bullet or phrase copied verbatim from resume",
      "betterAlternatives": [
        "A stronger rewrite option 1",
        "A stronger rewrite option 2"
      ],
      "rationale": "Why this rewrite is stronger"
    }
  ],
  "resumeTailoringsuggestions": [
    "specific suggestion for tailoring resume"
  ],
  "requiredExperience": {
    "years": 3,
    "details": "description of required experience"
  },
  "currentExperience": {
    "years": 2,
    "details": "summary of detected experience from resume"
  }
}

Rules:

- SKILL vs KEYWORD DISTINCTION (important):
  - matchingSkills / missingSkills must contain only concrete, discrete technologies, languages, tools, frameworks, or certifications (e.g. "Go", "Kubernetes", "AWS", "PMP certification") — things a candidate either has used or hasn't.
  - Do NOT put general competency phrases, practices, or experience descriptors (e.g. "production-grade software," "software architecture," "code review," "automated verification tools") into missingSkills — those belong in atsKeywords instead, since they describe practices/experience rather than a discrete skill.

- IMPORTANCE JUDGMENT (used internally for scoring and for importantMissingSkillsToLearn, not output as a separate field):
  - A skill is more important if it's explicitly under required/must-have qualifications in the JD, mentioned 2+ times, or appears in the job title/summary line.
  - A skill is less important if it's under preferred/bonus/plus qualifications, or mentioned only once in passing.

- SCORE CALCULATION — follow this exact method internally so scores stay consistent and accurately reflect the true severity of gaps (do not use flat point deductions with caps — use coverage percentages, which naturally scale down for poor matches):
  1. Classify every relevant skill (matched + missing) as "important" or "minor" per the rule above.
  2. Compute importantCoverage = (number of important skills matched) / (total important skills) × 100. If there are zero important skills identified, set importantCoverage to 100.
  3. Compute minorCoverage = (number of minor skills matched) / (total minor skills) × 100. If there are zero minor skills identified, set minorCoverage to 100.
  4. "skillMatch.score" = (0.85 × importantCoverage) + (0.15 × minorCoverage), rounded. This must genuinely approach 0 when nearly all important skills are missing — do not artificially floor this value.
  5. For experience: compute ratio = currentYears / requiredYears (if requiredYears is null or 0, skip this step and set experienceAlignment.score to 100).
     - If ratio >= 0.8: experienceAlignment.score = 100 (close-enough gaps like 3.5 vs 4 years are NOT penalized).
     - If ratio < 0.8: experienceAlignment.score = round(sqrt(ratio / 0.8) × 100). This must genuinely approach 0 when the candidate has little to no relevant experience (e.g. 0 years against a 3+ year requirement should score near 0, not just a small deduction).
  6. "overall" = round((0.7 × skillMatch.score) + (0.3 × experienceAlignment.score)).
  7. SELF-CONSISTENCY CHECK: before finalizing, re-read your own "shortSummary." If the summary describes significant gaps, lacking core skills, or lacking required experience, "overall" must be well below 60 — a summary describing a weak fit and a score describing an "excellent" fit must never contradict each other. If they conflict, recompute rather than output the inconsistency.
  8. Do not apply any artificial floor or cap beyond what the formula above naturally produces — a genuinely poor match (most important skills missing AND little to no required experience) should score in the 15-35 range, not 70+.

- atsKeywords: Extract 6-12 high-impact ATS keywords, core technical terms, tools, certifications, or domain words found in the JD that are MISSING or weak in the candidate's resume, using the JD's exact phrasing, ordered by impact (most important first). Include competency/practice phrases here (per the SKILL vs KEYWORD rule above) even if they're not in missingSkills.

- matchingSkills: A simple list of discrete skill names present in BOTH resume and JD.

- missingSkills: A simple list of discrete skill names required by the JD but NOT found in the resume.

- Deduplicate and normalize skill names across all lists (e.g. don't list "React" and "React.js" separately — use the JD's phrasing).

- importantMissingSkillsToLearn: A list of 3-5 skill names (strings) from missingSkills that are most important to learn first, based on the importance judgment above.

- phraseImprovementSuggestions: Return 2-5 weak resume phrases, prioritizing the weakest/most generic bullets.
  - "weakPhrase" must be copied VERBATIM (exact substring) from the resume text, not paraphrased.
  - Provide exactly 2 stronger rewrite alternatives per phrase.
  - "rationale" must be concise (max ~25 words).

- requiredExperience: Set "years" to a number ONLY if explicitly stated in the JD; otherwise null. Do not guess.

- currentExperience: Extract ONLY professional/paid working experience from the resume.
  - EXCLUDE academic projects, personal/side projects, and coursework entirely from the years calculation and from "details".
  - Set "years" to a number ONLY if clearly calculable from listed employment dates; otherwise null and explain why in "details".

- shortSummary: max 3 sentences. Keep all string fields concise and UI-friendly — no walls of text.

- Edge cases: If resumeText or jdText is empty, unreadable, or the resume is for an entirely unrelated field, still return the full JSON structure (empty arrays where appropriate, years as null) and note the issue clearly in "shortSummary".

- Return ONLY valid JSON: no trailing commas, no comments, no markdown formatting, no code fences, no extra text before or after the object.
`;
