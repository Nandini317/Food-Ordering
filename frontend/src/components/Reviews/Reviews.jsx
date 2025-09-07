import React, { useContext, useEffect, useState } from "react";
import "./reviews.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(url + "/api/rate/getAllRatings");
        setReviews(res.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [url]);

  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="reviews">
  <h2 className="reviews-title">What Our Customers Say</h2>
  <div className="reviews-slider-wrapper">
    <div className="reviews-slider">
      {reviews.concat(reviews).map((r, index) => (
        <div key={index} className="review-card">
          <strong className="review-username">{r.user?.name || "Anonymous"}</strong>
          <div className="review-stars">{"⭐".repeat(r.score)}</div>
          <p className="review-comment">{r.comment || "No comment provided."}</p>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default Reviews;
