import mongoose from 'mongoose';

const UnlockedPaperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
      index: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

UnlockedPaperSchema.index({ userId: 1, paperId: 1 }, { unique: true });

export default mongoose.models.UnlockedPaper ||
  mongoose.model('UnlockedPaper', UnlockedPaperSchema);
