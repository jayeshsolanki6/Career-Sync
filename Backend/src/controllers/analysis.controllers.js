import { getResumeJdText, extractResumeText } from '../services/upload.service.js';
import { analyzeResumeAndJd } from '../services/analysis.service.js';
import { calculateMatchScore, generateScoreInterpretation } from '../services/score.service.js';
import Analysis from '../models/analysis.model.js';
import Profile from '../models/profile.model.js';

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
    let resumeText = null;
    let jdText = null;

    // ── Phase 3: Use stored profile resume if available ──────────────────────
    const profile = await Profile.findOne({ userId: req.user._id });
    if (profile?.resumeText) {
      resumeText = profile.resumeText;
    }

    // ── Resolve JD text ──────────────────────────────────────────────────────
    if (req.body?.jdText?.trim()) {
      jdText = req.body.jdText.trim();
    } else if (req.files?.jd?.[0]) {
      jdText = await extractResumeText(req.files.jd[0]);
    }

    // ── Fallback: extract resume from uploaded file if no profile ────────────
    if (!resumeText) {
      if (!req.files?.resume?.[0]) {
        return res.status(400).json({
          message: 'No profile found. Please upload your resume or set up your profile first.',
        });
      }
      const summary = await getResumeJdText({ files: req.files, body: req.body });
      resumeText = summary.resumeText;
      jdText = jdText || summary.jdText;
    }

    if (!jdText) {
      return res.status(400).json({ message: 'Job description is required (paste text or upload a file).' });
    }

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
      targetRole: analysis.targetRole,
      phraseImprovementSuggestions: analysis.phraseImprovementSuggestions,
      resumeTailoringsuggestions: analysis.resumeTailoringsuggestions,
      requiredExperience: analysis.requiredExperience,
      currentExperience: analysis.currentExperience,
      score: scoreResult.overall
    });

    await newAnalysis.save();

    // Sync target role into User doc
    const normalizedTargetRole = analysis.targetRole?.trim();
    if (normalizedTargetRole) {
      req.user.targetRoles = req.user.targetRoles || [];
      const hasRole = req.user.targetRoles.some(
        (role) => role?.toLowerCase() === normalizedTargetRole.toLowerCase()
      );
      if (!hasRole) {
        req.user.targetRoles.push(normalizedTargetRole);
      }
      await req.user.save();
    }

    return res.status(200).json({
      message: 'Analysis complete.',
      data: {
        analysis,
        score: {
          overall: scoreResult.overall,
          breakdown: scoreResult.breakdown,
          interpretation,
        },
        usedProfileResume: !!profile?.resumeText,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Invalid upload payload.',
    });
  }
};
