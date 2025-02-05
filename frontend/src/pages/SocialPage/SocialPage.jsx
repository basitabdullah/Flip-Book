import React from 'react';
import './SocialPage.scss';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const SocialPage = () => {
  return (
    <div className="social-page">
      <h1>Connect With Us</h1>
      
      {/* Map Section */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9897290067227!2d77.5882468!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1709814407955!5m2!1sen!2sin"
          width="100%"
          height="180"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="contact-info">
        <div className="contact-item">
          <FaMapMarkerAlt className="icon" />
          <div className="info">
            <h3>Address</h3>
            <p>123 Rose Wood Avenue</p>
            <p>Bangalore, Karnataka 560004</p>
          </div>
        </div>

        <div className="contact-item">
          <FaPhone className="icon" />
          <div className="info">
            <h3>Phone</h3>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
        </div>

        <div className="contact-item">
          <FaEnvelope className="icon" />
          <div className="info">
            <h3>Email</h3>
            <a href="mailto:info@rosewood.com">info@rosewood.com</a>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <FaFacebook /> <span>Facebook</span>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <FaInstagram /> <span>Instagram</span>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <FaTwitter /> <span>Twitter</span>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
          <FaYoutube /> <span>YouTube</span>
        </a>
      </div>
    </div>
  );
};

export default SocialPage;
