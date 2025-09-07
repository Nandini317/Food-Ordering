import express from "express";
import { sendContactMessage , getAllFeedbacks , getFeedbackById } from "../controllers/contactController.js";
import authMiddleware from "../middleware/auth.js";


const contactRouter = express.Router();

contactRouter.post("/", authMiddleware , sendContactMessage);
contactRouter.get("/all",authMiddleware,  getAllFeedbacks);
contactRouter.get("/:id", authMiddleware, getFeedbackById); 
export default contactRouter;