import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            At OrderEase, we believe great food brings people together. Whether you're craving a quick bite or a full-course meal, we deliver fresh, flavorful dishes right to your doorstep — fast, reliable, and with a touch of love.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li></li>
            
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li><p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p></li>
            <li><p>Email:<a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=orderease@gmail.com"
                target="_blank"
                rel="noopener noreferrer">orderease@gmail.com</a>
              </p></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 @ OrderEase.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
