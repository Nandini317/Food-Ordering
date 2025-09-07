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

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        // Sort by createdAt descending (recent first)
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedOrders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
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

  // Apply filters
  const filteredData = data
    .filter(order =>
      statusFilter ? order.status.toLowerCase() === statusFilter.toLowerCase() : true
    )
    .filter(order =>
      dateFilter ? new Date(order.date).toISOString().split('T')[0] === dateFilter : true
    );

  // Function to get badge color
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

  {filteredData.length > 0 ? (
    <>
      {/* ✅ Filters only visible if there are orders */}
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

        <button onClick={() => { setStatusFilter(""); setDateFilter(""); }}>
          Clear Filters
        </button>
      </div>

      {/* Orders List */}
      <div className="container">
        {filteredData.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items
                .map((item, idx) => `${item.name} X ${item.quantity}`)
                .join(", ")}
            </p>
            <p>${order.amount.toFixed(2)}</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span className="status-badge">{order.status}</span>
            </p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </>
  ) : (
    // ✅ Empty state when no orders
    <div className="empty-orders">
      <img
        src="./overload.png"
        alt="No Orders"
        className="empty-orders-img"
      />
      <h3>Nothing cooking yet 🔥🍳</h3>
      <p>Place your first order and let the feast begin!</p>
      <button onClick={() => window.location.href = "/"}>Order Now</button>
    </div>
  )}
</div>

  );
};

export default MyOrders;
