import { model, Schema } from 'mongoose';

const analysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    shortSummary: { type: String },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    requiredSkills: [{ type: String }],
    importantMissingSkillsToLearn: [{ type: String }],
    resumeTailoringsuggestions: [{ type: String }],
    targetRole: { type: String },
    phraseImprovementSuggestions: [
      {
        weakPhrase: { type: String },
        betterAlternatives: [{ type: String }],
        rationale: { type: String }
      }
    ],
    requiredExperience: {
      years: { type: Number },
      details: { type: String },
    },
    currentExperience: {
      years: { type: Number },
      details: { type: String },
    },
    score: { type: Number }
  },
  { timestamps: true }
);

const Analysis = model('Analysis', analysisSchema);

export default Analysis;
