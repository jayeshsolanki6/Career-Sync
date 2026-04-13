import { getResumeJdText } from '../services/upload.service.js';
import { analyzeResumeAndJd } from '../services/analysis.service.js';
import { calculateMatchScore, generateScoreInterpretation } from '../services/score.service.js';
import Analysis from '../models/analysis.model.js';

export const getAnalysisHistoryController = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Analysis history fetched successfully.',
      data: analyses,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to fetch analysis history.',
    });
  }
};

export const uploadResumeAndJdController = async (req, res) => {
  try {
    const summary = await getResumeJdText({
      files: req.files,
      body: req.body,
    });

    const {resumeText, jdText} = summary;

    const analysis = await analyzeResumeAndJd(resumeText, jdText);

    const scoreResult = calculateMatchScore(analysis);
    const interpretation = generateScoreInterpretation(scoreResult.overall);

    const newAnalysis = new Analysis({
      userId: req.user._id,
      shortSummary: analysis.shortSummary,
      matchingSkills: analysis.matchingSkills,
      missingSkills: analysis.missingSkills,
      requiredSkills: analysis.requiredSkills,
      importantMissingSkillsToLearn: analysis.importantMissingSkillsToLearn,
      resumeTailoringsuggestions: analysis.resumeTailoringsuggestions,
      requiredExperience: analysis.requiredExperience,
      currentExperience: analysis.currentExperience,
      score: scoreResult.overall
    });
    
    await newAnalysis.save();

    return res.status(200).json({
      message: 'Upload received successfully.',
      data: {
        uploadSummary: summary,
        analysis,
        score: {
          overall: scoreResult.overall,
          breakdown: scoreResult.breakdown,
          interpretation,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Invalid upload payload.',
    });
  }
};
