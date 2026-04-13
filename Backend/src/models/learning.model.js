import { model, Schema } from 'mongoose';

const learningItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['To Learn', 'In Progress', 'Completed'],
      default: 'To Learn'
    },
    roadmap: {
      type: String, // To store the markdown AI generated plan
      default: null
    }
  },
  { timestamps: true }
);

// Ensure a user can only have a skill once in their queue
learningItemSchema.index({ userId: 1, skillName: 1 }, { unique: true });

const LearningItem = model('LearningItem', learningItemSchema);

export default LearningItem;
