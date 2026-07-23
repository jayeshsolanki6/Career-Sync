/**
 * Formats the LLM-generated score object directly.
 * Performs ZERO calculations — uses the raw scores provided by the LLM response.
 */
export function calculateMatchScore(analysis) {
  const scoreObj = typeof analysis?.score === 'object' ? analysis.score : {};
  const overall = typeof scoreObj.overall === 'number' ? scoreObj.overall : (typeof analysis?.score === 'number' ? analysis.score : 0);

  return {
    overall,
    breakdown: {
      skillMatch: {
        score: typeof scoreObj.breakdown?.skillMatch?.score === 'number' ? scoreObj.breakdown.skillMatch.score : overall,
        description: scoreObj.breakdown?.skillMatch?.description || '',
      },
      experienceAlignment: {
        score: typeof scoreObj.breakdown?.experienceAlignment?.score === 'number' ? scoreObj.breakdown.experienceAlignment.score : 100,
        description: scoreObj.breakdown?.experienceAlignment?.description || '',
      },
    },
  };
}

export const generateScoreInterpretation = (score) => {
  if (score >= 80) {
    return {
      level: 'Excellent Match',
      color: '#10b981',
      recommendation: 'Highly qualified. Consider for interview.',
      description: 'Strong candidate with most required skills and experience alignment.',
    };
  } else if (score >= 60) {
    return {
      level: 'Good Match',
      color: '#3b82f6',
      recommendation: 'Qualified. Consider for interview with slight training.',
      description: 'Candidate is capable, may need to develop some specific skills.',
    };
  } else if (score >= 40) {
    return {
      level: 'Moderate Match',
      color: '#f59e0b',
      recommendation: 'Potential. Requires ramp-up and training.',
      description: 'Candidate has foundation but will need time to acquire missing skills.',
    };
  } else if (score >= 20) {
    return {
      level: 'Poor Match',
      color: '#ef4444',
      recommendation: 'Consider only if pipeline is empty. Requires mentoring.',
      description: 'Significant gap between candidate profile and role requirements.',
    };
  } else {
    return {
      level: 'Not a Match',
      color: '#7f1d1d',
      recommendation: 'Not recommended. Major misalignment.',
      description: 'Candidate profile does not align with role requirements.',
    };
  }
};
