import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  account_id: { type: Number, unique: true },
  reputation: { type: Number },
  user_id: { type: Number, unique: true },
  user_type: { type: String, required: true },
  accept_rate: { type: Number },
  profile_image: { type: String },
  display_name: { type: String, required: true },
  link: { type: String }
});

export const Owner = mongoose.model("Owner", ownerSchema);


