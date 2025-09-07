import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id).select("-password");
    //console.log("in auth middleware" , user);
    req.body.userId = token_decode.id;
    req.user = user  ;
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};
export default authMiddleware;
