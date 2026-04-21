import mongoose from 'mongoose';

const SavedPaperSchema = new mongoose.Schema(
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
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

SavedPaperSchema.index({ userId: 1, paperId: 1 }, { unique: true });

export default mongoose.models.SavedPaper ||
  mongoose.model('SavedPaper', SavedPaperSchema);
