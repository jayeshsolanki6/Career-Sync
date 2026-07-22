import { model, Schema } from 'mongoose';

const resumeHealthSchema = new Schema({
  // Action verb usage analysis
  actionVerbScore: { type: Number, default: null },       // 0-100
  actionVerbFeedback: { type: String, default: null },

  // Readability / formatting analysis
  readabilityScore: { type: Number, default: null },      // 0-100
  readabilityFeedback: { type: String, default: null },

  // General improvement tips
  improvementSuggestions: [{ type: String }],

  // Specific phrase improvements
  phraseImprovements: [{
    originalPhrase: { type: String },
    improvedPhrase: { type: String },
    reason: { type: String }
  }],
}, { _id: false });

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,          // one profile per user
    },

    // Raw text extracted from the uploaded PDF/DOCX
    resumeText: { type: String, default: '' },

    // File metadata (name only — we don't persist the binary)
    resumeFileName: { type: String, default: null },

    // AI-extracted structured data
    skills: [{ type: String, trim: true }],
    experienceYears: { type: Number, default: 0 },
    experienceSummary: { type: String, default: null },
    targetRoles: [{ type: String, trim: true }],

    // Standalone resume health (no JD required)
    resumeHealth: { type: resumeHealthSchema, default: null },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Profile = model('Profile', profileSchema);

export default Profile;
