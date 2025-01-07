import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
  question_id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  tags: { type: [String], required: true },
  is_answered: { type: Boolean, required: true },
  view_count: { type: Number, required: true },
  answer_count: { type: Number, required: true },
  score: { type: Number, required: true },
  closed_date: { type: Date },
  last_activity_date: { type: Date, required: true },
  creation_date: { type: Date, required: true },
  last_edit_date: { type: Date },
  link: { type: String, required: true },
  closed_reason: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
});

export const Question = mongoose.model("Question", questionSchema);

