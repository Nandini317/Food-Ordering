import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addRating , getUserRatings , getRatings} from "../controllers/rateController.js";
const rateRouter = express.Router() ; 
rateRouter.post("/add",authMiddleware,addRating) ;
rateRouter.get("/getUserRatings",authMiddleware,getUserRatings) ;
rateRouter.get("/getAllRatings",getRatings) ;

export default rateRouter ; 