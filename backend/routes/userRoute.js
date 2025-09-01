import express from "express";
import { loginUser, registerUser ,getUserProfile ,updateUserPassword , updateName} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.put("/update" , authMiddleware , updateName) ; 
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile" ,authMiddleware, getUserProfile) ; 
userRouter.put("/update-password", authMiddleware, updateUserPassword);
export default userRouter;
