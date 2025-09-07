import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required:true }, // optional reference to User
    createdAt: { type: Date, default: Date.now }
  },
  { minimize: false } // keeps empty objects if needed
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
