import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // Just simple strings/numbers for filtering
  subject: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },

  // For testing, just store the direct URL to the PDF/Image
  // (e.g., a link to your public folder or a simple S3 link)
  url: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Paper || mongoose.model('Paper', PaperSchema);