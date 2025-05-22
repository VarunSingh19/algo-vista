import mongoose from "mongoose";

const CodingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [String],
    constraints: {
      type: String,
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    solutionApproach: {
      type: String,
    },
    timeComplexity: {
      type: String,
    },
    spaceComplexity: {
      type: String,
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

export default mongoose.models.CodingProblem ||
  mongoose.model("CodingProblem", CodingProblemSchema);
