import React from "react";
import "./Footer.scss";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <ContactInfo />
        <SocialLinks />
      </div>

      <div className="footer__bottom">
        <p>&copy; {currentYear} Gabfire. All rights reserved.</p>
      </div>
    </footer>
  );
};
const ContactInfo = () => {
  return (
    <div className="footer__section">
      <h3>Contact Info</h3>
      <ul>
        <li>
          <i className="fas fa-map-marker-alt"></i>
          123 Business Street, Suite 100
        </li>
        <li>
          <i className="fas fa-phone"></i>
          +1 (555) 123-4567
        </li>
        <li>
          <i className="fas fa-envelope"></i>
          info@example.com
        </li>
      </ul>
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="footer__section">
      <h3>Follow Us</h3>
      <div className="footer__social">
        <a href="#" className="social-link">
          <FaTwitter />
        </a>
        <a href="#" className="social-link">
        <FaFacebookSquare/>
        </a>
        <a href="#" className="social-link">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="social-link">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
};
export default Footer;
