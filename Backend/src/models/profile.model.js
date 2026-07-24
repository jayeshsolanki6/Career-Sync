import { model, Schema } from 'mongoose';

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, 
    },

    resumeText: { type: String, default: '' },

    resumeFileName: { type: String, default: null },

    skills: [{ type: String, trim: true }],
    experienceSummary: { type: String, default: null },
    targetRoles: [{ type: String, trim: true }],

    resumeHealth: {
      actionVerbScore: { type: Number, default: null },       // 0-100
      actionVerbFeedback: { type: String, default: null },
      readabilityScore: { type: Number, default: null },      // 0-100
      readabilityFeedback: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const Profile = model('Profile', profileSchema);

export default Profile;
