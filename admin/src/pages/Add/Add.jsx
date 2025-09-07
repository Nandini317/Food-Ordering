import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, admin ,url , loading} = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    const fetchFood = async () => {
      console.log("id", id);
      if (id) {
        try {
          console.log("yes id is there ")
          const response = await axios.get(`${url}/api/food/get-food/${id}`, {
            headers: { token }
          });
          console.log("response" , response);
          if (response.data.success) {
            setData({
              name: response.data.data.name,
              description: response.data.data.description,
              price: response.data.data.price,
              category: response.data.data.category,
              image : response.data.data.image,
            });
          }
          else {
            toast.error("Food not found");

            console.log(response);
          }

        } catch (error) {
          toast.error("Error fetching food details");
        }

      }
    }
      fetchFood();

  }, [id , url , token])


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image && typeof image !== "string") {
    // Only append new image if it's a File, not existing image URL
    formData.append("image", image);
  }
  try {
    let response;

    if (id) {
      //  Editing existing food item
      response = await axios.put(`${url}/api/food/update/${id}`, formData, {
        headers: { token },
      });
    } else {
      // ➕ Adding new food item
      response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { token },
      });
    }

    if (response.data.success) {
      toast.success(response.data.message);
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      navigate("/list"); // or wherever you want
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }

    
  };
  useEffect(() => {
    if (loading) return; 
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
  }, [admin , token , loading , navigate])
  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          {id?"Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Add;
