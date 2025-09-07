import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./feedbacks.css";
import { Link } from "react-router-dom";
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token ,admin ,url } = useContext(StoreContext);

  useEffect(() => {
    if(!token || !url)return ; 
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${url}/api/contact/all`, {
          headers: {
            token
          },
        });
        console.log(res.data);
        setFeedbacks(res.data);
      } catch (err) {
        alert("Failed to fetch feedbacks");
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, [token, url]);

  if (!token || !url) {
    return <div className="admin-feedbacks"><p>Loading...</p></div>;
  }
  return (
    <div className="admin-feedbacks">
      <h2>User Feedbacks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Message</th>
      <th>Date</th>
      <th>Action</th> {/* New column for button */}
    </tr>
  </thead>
  <tbody>
    {feedbacks.map(fb => (
      <tr key={fb._id}>
        <td>{fb.name}</td>
        <td>{fb.email}</td>
        <td>
  {fb.message.length > 20
    ? fb.message.substring(0, 40) + "..."
    : fb.message}
</td>

        <td>{new Date(fb.createdAt).toLocaleString()}</td>
        <td>
          <Link to={`/admin/feedbacks/${fb._id}`}>
            <button className="view-btn">read </button>
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
};

export default Feedbacks;