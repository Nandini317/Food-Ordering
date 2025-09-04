import React, { useState, useContext } from "react";
import './contactus.css';
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  //const [responseMsg, setResponseMsg] = useState({ text: "", type: "" }); // new state
  const { token, url } = useContext(StoreContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/contact`, formData, { headers: { token } });
      if (res.data.success) {
        toast.success("feedback sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Please login first");
      }
    } catch (err) {
      toast.error("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We’d love to hear from you! Fill out the form below and we’ll get back to you soon.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Your Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Your Email</label>
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <label>Your Message</label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="contact-info">
          <p>Email:   <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=orderease@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    orderease@gmail.com
  </a></p>
          <p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

