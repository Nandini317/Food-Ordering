import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

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

      {/* Filter Section */}
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

      <div className="container">
        {filteredData.length > 0 ? (
          filteredData.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, idx) => `${item.name} X ${item.quantity}`).join(", ")}
              </p>
              <p>${order.amount.toFixed(2)}</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span
                  className="status-badge"
                  
                >
                  {order.status}
                </span>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        ) : (
          <p className="noordersyet">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
