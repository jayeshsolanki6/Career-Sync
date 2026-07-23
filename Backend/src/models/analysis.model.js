import { model, Schema } from 'mongoose';

const analysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    shortSummary: { type: String },
    atsKeywords: [{ type: String, trim: true }],
    matchingSkills: [Schema.Types.Mixed],
    missingSkills: [Schema.Types.Mixed],
    importantMissingSkillsToLearn: [{ type: String, trim: true }],
    resumeTailoringsuggestions: [{ type: String }],
    targetRole: { type: String, trim: true },
    phraseImprovementSuggestions: [
      {
        weakPhrase: { type: String },
        betterAlternatives: [{ type: String }],
        rationale: { type: String }
      }
    ],
    requiredExperience: {
      years: { type: Number, default: null },
      details: { type: String },
    },
    currentExperience: {
      years: { type: Number, default: 0 },
      details: { type: String },
    },
    score: { type: Number, default: 0 },
    scoreDetails: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Compound index to accelerate fetching user analysis history ordered by date
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = model('Analysis', analysisSchema);

export default Analysis;
