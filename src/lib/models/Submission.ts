import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingProblem",
    required: true,
  },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;
