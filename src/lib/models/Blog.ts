import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    tags: [String],
    coverImage: {
      type: String,
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
