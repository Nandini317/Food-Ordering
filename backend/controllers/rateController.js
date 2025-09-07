import ratingModel from "../models/rateModel.js";
import orderModel from "../models/orderModel.js";

export const addRating = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { orderId, rating, comment } = req.body;
    const userId = req.user.id; // from verifyToken middleware
    const score = rating;

    if (!orderId || !score) {
      return res.status(400).json({ success: false, message: "Missing orderId or score" });
    }

    // Verify the order exists and belongs to this user
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to rate this order" });
    }

    // Only allow rating if order is delivered
    if (order.status.toLowerCase() !== "delivered") {
      return res.status(400).json({ success: false, message: "You can rate only delivered orders" });
    }

    // Check if a rating already exists for this order by this user
    let existingRating = await ratingModel.findOne({ order: orderId, user: userId });
    if (existingRating) {
      // Rating already exists → do not allow update
      return res.status(400).json({ success: false, message: "You have already rated this order" });
    }

    // Create new rating
    const newRating = await ratingModel.create({
      order: orderId,
      user: userId,
      score,
      comment,
    });

    res.json({ success: true, data: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("inside rating" , userId) ; 
    const userRatings = await ratingModel.find({ user: userId });
    res.json({ success: true, data: userRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRatings = async(req , res) =>{
  try {
    const ratings =  await ratingModel
      .find()
      .populate("user", "name")   // fetch only user's name
      .populate("order", "items") // optional: fetch items of order
      .sort({ createdAt: -1 })
      .limit(20);
    console.log("ratings are : " , ratings) ; 
    res.json({ success: true, data: ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
