import mongoose from 'mongoose';

const SheetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  totalProblems: { type: Number, required: true },
  sections: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    topics: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      problems: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        problemLink: { type: String },
        videoLink: { type: String },
        editorialLink: { type: String },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
      }]
    }]
  }]
});

export default mongoose.models.Sheet || mongoose.model('Sheet', SheetSchema);
