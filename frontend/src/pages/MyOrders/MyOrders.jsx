
import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedOrders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user's existing ratings
  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${url}/api/rate/getUserRatings`, {
        headers: { token },
      });
      console.log("User ratings:", res);
      if (res.data.success) {
        setRatings(res.data.data); // array of ratings
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openRatingPopup = (order) => {
    setSelectedOrder(order);
    setRating(0); // reset rating
    setIsPopupOpen(true);
  };

  const submitRating = async () => {
    try {
      if (!rating) return alert("Please select a rating!");

      const response = await axios.post(
        url + "/api/rate/add",
        { orderId: selectedOrder._id, rating ,comment },
        { headers: { token } }
      );

      if (response.data.success) {
        
        setRatings((prev) => [...prev, response.data.data]); // update local ratings
        setIsPopupOpen(false);
      }
    } catch (err) {
      console.error(err);
      
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchRatings();
    }
  }, [token]);

  useEffect(() => {
    socket.on("orderUpdated", (updatedOrder) => {
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  const filteredData = data
    .filter((order) =>
      statusFilter
        ? order.status.toLowerCase() === statusFilter.toLowerCase()
        : true
    )
    .filter((order) =>
      dateFilter
        ? new Date(order.date).toISOString().split("T")[0] === dateFilter
        : true
    );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "green";
      case "out for delivery":
        return "orange";
      case "food processing":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="filter-container">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            <label>Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <button
              onClick={() => {
                setStatusFilter("");
                setDateFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>

      {filteredData.length > 0 ? (
        <>
          

          <div className="container">
            {filteredData.map((order, index) => {
              const isDelivered =
                order.status.toLowerCase() === "delivered";
              const alreadyRated = ratings.some(
                (r) => r.order === order._id
              );
              const canRate = isDelivered && !alreadyRated;

              return (
                <div key={index} className="my-orders-order">
                  <img src={assets.parcel_icon} alt="" />
                  <p>
                    {order.items
                      .map((item) => `${item.name} X ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p>${order.amount.toFixed(2)}</p>
                  <p>Items: {order.items.length}</p>
                  <p>
                    <span
                      className="status-badge"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </p>
                  <button
                    onClick={() => canRate && openRatingPopup(order)}
                    disabled={!canRate}
                    title={
                      !isDelivered
                        ? "You can rate only delivered orders"
                        : alreadyRated
                        ? "You have already rated this order"
                        : ""
                    }
                  >
                     {isDelivered ? (alreadyRated ? "Rated" : "Rate Order") : "Awaiting delivery"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-orders">
          <img
            src="./overload.png"
            alt="No Orders"
            className="empty-orders-img"
          />
          <h3>Nothing cooking yet 🔥🍳</h3>
          <p>Place your first order and let the feast begin!</p>
          <button onClick={() => (window.location.href = "/")}>
            Order Now
          </button>
        </div>
      )}

      {/* Rating Popup */}
      {isPopupOpen && (
  <div className="popup-overlay">
    <div className="popup-content">
      <h3>Rate Your Order</h3>
      <p>
        Order:{" "}
        {selectedOrder.items.map((item) => item.name).join(", ")}
      </p>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "filled-star" : "empty-star"}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "10px",
          resize: "none",
        }}
      />

      <button className="btn" onClick={submitRating}>
        Submit
      </button>
      <button
        className="btn"
        onClick={() => setIsPopupOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default MyOrders;
