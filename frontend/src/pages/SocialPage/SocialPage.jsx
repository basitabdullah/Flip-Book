import React from "react";
import "./SocialPage.scss";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const SocialPage = ({ pageData }) => {
  const {
    title,
    subtitle,
    street,
    city,
    postalCode,
    phone,
    email,
    mapUrl,
    socialLinks
  } = pageData;

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook />;
      case 'instagram':
        return <FaInstagram />;
      case 'twitter':
        return <FaTwitter />;
      case 'youtube':
        return <FaYoutube />;
      default:
        return null;
    }
  };

  return (
    <div className="social-page">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>

      {/* Map Section */}
      <div className="map-container">
        <iframe
          src={mapUrl}
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
            <p>{street}</p>
            <p>{city}, {postalCode}</p>
          </div>
        </div>

        <div className="contact-item">
          <FaPhone className="icon" />
          <div className="info">
            <h3>Phone</h3>
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        </div>

        <div className="contact-item">
          <FaEnvelope className="icon" />
          <div className="info">
            <h3>Email</h3>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-icon ${social.platform}`}
          >
            {getSocialIcon(social.platform)}
            <span>{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialPage;
