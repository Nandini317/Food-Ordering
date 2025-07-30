import express from "express";
import { addFood, listFood, removeFood ,getfood ,updatefood} from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})

foodRouter.post("/add",upload.single("image"),authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);
foodRouter.get("/get-food/:id" , authMiddleware , getfood); 
foodRouter.put("/update/:id" , upload.single("image"),authMiddleware ,updatefood );
export default foodRouter;
