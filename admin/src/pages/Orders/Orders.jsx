import React, { useState, useEffect, useContext, useMemo } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

const STATUS_OPTIONS = ["All", "Food Processing", "Out for delivery", "Delivered"];

const titleCase = (str = "") =>
  str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const formatAddress = (a = {}) => {
  const line1 = [a.street].filter(Boolean).join(", ");
  const line2 = [a.city, a.state, a.country, a.zipcode].filter(Boolean).join(", ");
  return { line1, line2 };
};

const statusClass = (s) => {
  if (s === "Delivered") return "status-delivered";
  if (s === "Out for delivery") return "status-out";
  return "status-processing";
};

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const { token, admin, url, loading } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  // Lazy loading
  const ORDERS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(ORDERS_PER_PAGE);

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) setOrders(response.data.data);
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      { orderId, status: event.target.value },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
      return;
    }

    fetchAllOrder();
    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => {
        if (prev.some((o) => o._id === newOrder._id)) return prev;
        return [newOrder, ...prev];
      });
      toast.info("🚀 New order received!");
    });

    return () => {
      socket.off("newOrder");
    };
  }, [admin, token, loading, navigate]);

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length, "Food Processing": 0, "Out for delivery": 0, Delivered: 0 };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => statusFilter === "All" || o.status === statusFilter),
    [orders, statusFilter]
  );

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((prev) => prev + ORDERS_PER_PAGE);

  return (
    <div className="order">
      <h3>Order Page</h3>

      <div className="filter-bar">
        <span className="filter-label">Filter by Status:</span>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`filter-chip ${statusFilter === s ? "active" : ""}`}
            onClick={() => {
              setStatusFilter(s);
              setVisibleCount(ORDERS_PER_PAGE); // reset visibleCount when filter changes
            }}
            type="button"
          >
            {s} <span className="chip-count">{statusCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="order-list">
        {visibleOrders.length === 0 && (
          <div className="empty">No orders found for this filter.</div>
        )}

        {visibleOrders.map((order) => {
          const { line1, line2 } = formatAddress(order.address);
          const customer =
            titleCase(`${order.address.firstName || ""} ${order.address.lastName || ""}`);

          return (
            <div key={order._id} className="order-item">
              <div className="order-item-left">
                <img src={assets.parcel_icon} alt="Order" />
                <div className="order-item-details">
                  <p className="order-item-food">
                    {order.items.map((it) => `${it.name} x ${it.quantity}`).join(", ")}
                  </p>
                  <p className="order-item-name">{customer}</p>
                  <div className="order-item-address">
                    {line1 && <p>📍 {line1}</p>}
                    {line2 && <p>{line2}</p>}
                  </div>
                  {order.address.phone && (
                    <p className="order-item-phone">📞 {order.address.phone}</p>
                  )}
                </div>
              </div>

              <div className="order-item-right">
                <span className={`status-badge ${statusClass(order.status)}`}>
                  {order.status}
                </span>
                <p className="order-item-meta">Items: {order.items.length}</p>
                <p className="order-item-price">${order.amount}</p>

                <select
                  className="status-select"
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          );
        })}

        {visibleCount < filteredOrders.length && (
          <button onClick={loadMore} className="load-more-btn">
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Orders;

