import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema({
  uploaderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  institute: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  program: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1 },
  year: { type: Number, required: true, min: 2000 },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  isExtracted: { type: Boolean, default: false },
  storageFileName: { type: String, required: true, trim: true },
  storageURL: { type: String, required: true, trim: true },
  unlockCounts: { type: Number, default: 0, min: 0 },
  saveCounts: { type: Number, default: 0, min: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

PaperSchema.index({ status: 1, uploadedAt: -1 });
PaperSchema.index({ uploaderID: 1, status: 1 });
PaperSchema.index({ specialization: 1, program: 1, semester: 1, year: 1, status: 1 });

export default mongoose.models.Paper || mongoose.model('Paper', PaperSchema);