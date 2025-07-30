import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// add food items

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`, () => {});
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const editFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      if(req.file){
        fs.unlink(`uploads/${food.image}`,()=>{})
        food.image = req.file.filename; 
      }
      food.name = req.body.name || food.name;
      food.description = req.body.description || food.description;
      food.price = req.body.price || food.price;
      food.category = req.body.category || food.category;
      await food.save();
      res.json({ success: true, message: "Food Updated" });   
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getfood = async(req , res) =>{
  try{
    const foodId = req.params.id ; 
    const food = await foodModel.findById(foodId);
    if(food){
      res.json({ success: true,data : food ,  message: "Food Updated" })
    }
    else{
      res.json({ success: false, message: "Food not found" })
    }
  }
  catch(error){
    console.log(error) ; 
    res.json({ success: false, message: "Error" })
  }
}
const updatefood = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : undefined;

  try {
    const updateData = { name, description, price, category };
    if (image) updateData.image = image;

    await foodModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Food item updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
}
export { addFood, listFood, removeFood ,editFood ,getfood ,updatefood};
