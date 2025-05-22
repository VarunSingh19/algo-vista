import mongoose from "mongoose";

const BlogReadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate records
BlogReadSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.models.BlogRead ||
  mongoose.model("BlogRead", BlogReadSchema);
