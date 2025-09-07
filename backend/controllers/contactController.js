import Contact from "../models/contactModel.js";
import userModel from "../models/userModel.js";

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  
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


export const getFeedbackById = async (req, res) => {
  try {
    // verify admin
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      const { id } = req.params;
      const feedback = await Contact.findById(id);
      console.log("feedback is" , feedback ); 

      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found." });
      }

      res.status(200).json(feedback);
    } else {
      res.status(403).json({ error: "Access denied." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};


export const getAllFeedbacks = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    console.log(userData) ; 
    if(userData && userData.role === "admin"){
      const feedbacks = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(feedbacks);
    }
    else{
      res.status(403).json({ error: "Access denied." });
    }
    
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};