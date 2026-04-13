const calculateSkillMatchScore = (analysis) => {
  const matchingCount = analysis.matchingSkills?.length || 0;
  const requiredCount = analysis.requiredSkills?.length || 0;

  if (requiredCount === 0) {
    return 0;
  }

  return Math.round((matchingCount / requiredCount) * 100);
};

const calculateExperienceAlignmentScore = (analysis) => {
  const required = analysis.requiredExperience?.years || 0;
  const current = analysis.currentExperience?.years || 0;

  if (current >= required) {
    return 100;
  }

  if (required === 0) {
    return 0;
  }

  const experienceRatio = current / required;
  return Math.round(experienceRatio * 100);
};

export const calculateMatchScore = (analysis) => {
  const skillScore = calculateSkillMatchScore(analysis);
  const experienceScore = calculateExperienceAlignmentScore(analysis);
  const overall = Math.round(skillScore * 0.7 + experienceScore * 0.3);

  return {
    overall,
    breakdown: {
      skillMatch: {
        score: skillScore,
        description: `${analysis.matchingSkills?.length || 0}/${analysis.requiredSkills?.length || 0} required skills found`,
      },
      experienceAlignment: {
        score: experienceScore,
        description: `${analysis.currentExperience?.years || 0} years vs ${analysis.requiredExperience?.years || 0} required`,
      },
    },
  };
};

export const generateScoreInterpretation = (score) => {
  if (score >= 80) {
    return {
      level: 'Excellent Match',
      color: '#10b981',
      recommendation: 'Highly qualified. Consider for interview.',
      description:
        'Strong candidate with most required skills and experience alignment.',
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
      description:
        'Candidate has foundation but will need time to acquire missing skills.',
    };
  } else if (score >= 20) {
    return {
      level: 'Poor Match',
      color: '#ef4444',
      recommendation: 'Consider only if pipeline is empty. Requires mentoring.',
      description:
        'Significant gap between candidate profile and role requirements.',
    };
  } else {
    return {
      level: 'Not a Match',
      color: '#7f1d1d',
      recommendation: 'Not recommended. Major misalignment.',
      description:
        'Candidate profile does not align with role requirements.',
    };
  }
};
