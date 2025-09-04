import Contact from "../models/contactModel.js";
export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  // You can save to DB or send email here. For now, just log:
  try {
    const contact = new Contact({
      name,
      email,
      message,
      user: req.user ? req.user.id : undefined // if using authMiddleware
    });
    await contact.save();
    console.log("done")
    return res.status(200).json({ success: true, msg: "Message received!" });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};