import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./feedbackDetails.css";

const FeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, admin ,url } = useContext(StoreContext);

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/contact/${id}`, {
          headers: { token },
        });
        setFeedback(res.data);
        setError(null);
      } catch (err) {
        setError("Could not fetch feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id, token, url]);

  if (!admin) return <div className="feedback-detail error">Unauthorized</div>;
  if (loading) return <div className="feedback-detail loading">Loading...</div>;
  if (error) return <div className="feedback-detail error">{error}</div>;
  if (!feedback) return <div className="feedback-detail error">Feedback not found.</div>;

  return (
    <div className="feedback-detail">
      <div className="feedback-header">
        <button className="back-btn" onClick={() => navigate("/feedbacks")}>
          ← Back
        </button>
        <h2>User Feedback Detail</h2>
      </div>

      <div className="feedback-card">
        <div className="feedback-item">
          <span className="label">Name</span>
          <span className="value">{feedback.name}</span>
        </div>
        <div className="feedback-item">
          <span className="label">Email</span>
          <span className="value">{feedback.email}</span>
        </div>
        <div className="feedback-item">
          <span className="label">Message</span>
          <p className="value message">{feedback.message}</p>
        </div>
        <div className="feedback-item">
          <span className="label">Date</span>
          <span className="value">{new Date(feedback.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;

