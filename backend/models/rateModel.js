import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
     order: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
 
}, { timestamps: true });

const ratingModel = mongoose.model("Rating", ratingSchema);
export default ratingModel;