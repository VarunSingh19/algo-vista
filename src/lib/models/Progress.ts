import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  sheetId: { type: mongoose.Types.ObjectId, ref: "Sheet", required: true },
  completedProblemIds: { type: [String], default: [] },
});

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);
