import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import authMiddleware from "../middleware/auth.js";


const contactRouter = express.Router();

contactRouter.post("/", authMiddleware , sendContactMessage);

export default contactRouter;