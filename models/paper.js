import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // Just simple strings/numbers for filtering
  subject: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  
  // Department field: CS, mining, cement, or others
  department: { 
    type: String, 
    required: true,    
    default: 'CS'
  },
  
  // Program field: B.tech, BE, BSc, or anything
  program: { 
    type: String, 
    required: true,
    default: 'B.tech'
  },

  // For testing, just store the direct URL to the PDF/Image
  // (e.g., a link to your public folder or a simple S3 link)
  url: { type: String, required: true },

  // Track who uploaded the paper
  uploadedBy: { type: String, required: true }, // Email of the user who uploaded

  // Admin approval status
  adminApproved: { type: Boolean, default: false }, // Whether the paper is approved by admin

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Paper || mongoose.model('Paper', PaperSchema);