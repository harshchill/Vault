import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterEmail: { type: String, required: true, trim: true },
    institute: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    voteCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["open", "fulfilled", "rejected"],
      default: "open",
    },
  },
  { timestamps: true }
);

RequestSchema.index({ status: 1, createdAt: -1 });
RequestSchema.index({ status: 1, voteCount: -1, createdAt: -1 });
RequestSchema.index({ program: 1, specialization: 1, semester: 1, year: 1, institute: 1 });

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
