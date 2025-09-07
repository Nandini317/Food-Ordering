import React, { useState, useEffect, useContext, useMemo } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

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
  return "status-processing"; // Food Processing or anything else
};

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const { token, admin, url, loading } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

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
  }, [admin , token , loading ,navigate]);

  // counts for chips
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length, "Food Processing": 0, "Out for delivery": 0, Delivered: 0 };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const visibleOrders = useMemo(
    () => orders.filter((o) => statusFilter === "All" || o.status === statusFilter),
    [orders, statusFilter]
  );

  return (
    <div className="order">
      <h3>Order Page</h3>

      {/* Filter Bar (chips with counts) */}
      <div className="filter-bar">
        <span className="filter-label">Filter by Status:</span>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`filter-chip ${statusFilter === s ? "active" : ""}`}
            onClick={() => setStatusFilter(s)}
            type="button"
          >
            {s} <span className="chip-count">{statusCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="order-list">
        {visibleOrders.length === 0 && (
          <div className="empty">No orders found for this filter.</div>
        )}

        {visibleOrders.map((order) => {
          const { line1, line2 } = formatAddress(order.address);
          const customer =
            titleCase(`${order.address.firstName || ""} ${order.address.lastName || ""}`);

          return (
            <div key={order._id || order.id} className="order-item">
              {/* Left */}
              <div className="order-item-left">
                <img src={assets.parcel_icon} alt="Order" />
                <div className="order-item-details">
                  <p className="order-item-food">
                    {order.items
                      .map((it) => `${it.name} x ${it.quantity}`)
                      .join(", ")}
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

              {/* Right */}
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
      </div>
    </div>
  );
};

export default Orders;
