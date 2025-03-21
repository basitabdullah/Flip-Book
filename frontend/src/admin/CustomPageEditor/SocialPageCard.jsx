import React, { useState, useEffect } from "react";
import useSocialPageStore from "../../stores/useSocialPageStore";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./SocialPageCard.scss";

const defaultData = {
  title: "",
  subtitle: "",
  street: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  mapUrl: "",
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "youtube", url: "https://youtube.com" },
  ],
};

const SocialPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateSocialPage, deleteSocialPage } = useSocialPageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(defaultData);

  useEffect(() => {
    if (pageData) {
      setEditedData({
        title: pageData.title || "",
        subtitle: pageData.subtitle || "",
        street: pageData.street || "",
        city: pageData.city || "",
        postalCode: pageData.postalCode || "",
        phone: pageData.phone || "",
        email: pageData.email || "",
        mapUrl: pageData.mapUrl || "",
        socialLinks: pageData.socialLinks || defaultData.socialLinks,
      });
    }
  }, [pageData]);

  if (loading) {
    return <div className="social-card loading">Loading...</div>;
  }

  if (!pageData) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditedData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.platform === platform ? { ...link, url: value } : link
      ),
    }));
  };

  const handleSave = async () => {
    try {
      await updateSocialPage(flipbookId, pageData._id, {
        ...editedData,
        pageNumber,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating social page:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSocialPage(flipbookId, pageData._id);
    } catch (error) {
      console.error("Error deleting social page:", error);
    }
  };

  return (
    <div className="social-card">
      <div className="card-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="actions">
          {isEditing ? (
            <>
              <FaSave onClick={handleSave} className="save-icon" />
              <FaTimes
                onClick={() => setIsEditing(false)}
                className="cancel-icon"
              />
            </>
          ) : (
            <>
              <FaEdit
                onClick={() => setIsEditing(true)}
                className="edit-icon"
              />
              <FaTrash onClick={handleDelete} className="delete-icon" />
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="card-content">
          <div className="view-mode">
            <div className="info-section">
              <div className="field-group">
                <label>Title</label>
                <h3>{editedData.title}</h3>
              </div>

              <div className="field-group">
                <label>Subtitle</label>
                <p className="subtitle">{editedData.subtitle}</p>
              </div>
            </div>

            <div className="info-section">
              <div className="field-group">
                <label>Address</label>
                <p>{editedData.street}</p>
                <p>
                  {editedData.city}, {editedData.postalCode}
                </p>
              </div>

              <div className="field-group">
                <label>Contact</label>
                {editedData.phone && (
                  <div className="multi-contact">
                    {editedData.phone.split(",").map((phone, index) => (
                      <p key={index}>{phone.trim()}</p>
                    ))}
                  </div>
                )}
                {editedData.email && (
                  <div className="multi-contact">
                    {editedData.email.split(",").map((email, index) => (
                      <p key={index}>{email.trim()}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {editedData.mapUrl && (
              <div className="info-section">
                <label>Location Map</label>
                <div className="map">
                  <iframe
                    src={editedData.mapUrl}
                    title="Location Map"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            <div className="info-section">
              <label>Social Media Links</label>
              <div className="social-links">
                {editedData.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.platform === "facebook" && <FaFacebook />}
                    {link.platform === "instagram" && <FaInstagram />}
                    {link.platform === "twitter" && <FaTwitter />}
                    {link.platform === "youtube" && <FaYoutube />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={editedData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtitle">Subtitle</label>
            <input
              id="subtitle"
              type="text"
              name="subtitle"
              value={editedData.subtitle}
              onChange={handleChange}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              id="street"
              type="text"
              name="street"
              value={editedData.street}
              onChange={handleChange}
              placeholder="Enter street address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={editedData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={editedData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Numbers</label>
            <textarea
              id="phone"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
              placeholder="Enter phone numbers (separate with commas)"
              rows="2"
            />
            <small className="helper-text">
              Example: +1 234-567-8900, +1 234-567-8901
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Addresses</label>
            <textarea
              id="email"
              name="email"
              value={editedData.email}
              onChange={handleChange}
              placeholder="Enter email addresses (separate with commas)"
              rows="2"
            />
            <small className="helper-text">
              Example: contact@example.com, support@example.com
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="mapUrl">Google Maps URL</label>
            <input
              id="mapUrl"
              type="url"
              name="mapUrl"
              value={editedData.mapUrl}
              onChange={handleChange}
              placeholder="Enter Google Maps URL"
            />
          </div>

          <div
            className="social-links"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
              padding: "1.5rem",
              background: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                padding: "1.25rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              <label
                htmlFor="facebook"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                <FaFacebook
                  style={{
                    color: "#1877f2",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
                Facebook
              </label>
              <input
                id="facebook"
                type="url"
                value={
                  editedData.socialLinks.find(
                    (link) => link.platform === "facebook"
                  )?.url
                }
                onChange={(e) =>
                  handleSocialLinkChange("facebook", e.target.value)
                }
                placeholder="Facebook URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                padding: "1.25rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              <label
                htmlFor="instagram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                <FaInstagram
                  style={{
                    color: "#e4405f",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
                Instagram
              </label>
              <input
                id="instagram"
                type="url"
                value={
                  editedData.socialLinks.find(
                    (link) => link.platform === "instagram"
                  )?.url
                }
                onChange={(e) =>
                  handleSocialLinkChange("instagram", e.target.value)
                }
                placeholder="Instagram URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                padding: "1.25rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              <label
                htmlFor="twitter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                <FaTwitter
                  style={{
                    color: "#1da1f2",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
                Twitter
              </label>
              <input
                id="twitter"
                type="url"
                value={
                  editedData.socialLinks.find(
                    (link) => link.platform === "twitter"
                  )?.url
                }
                onChange={(e) =>
                  handleSocialLinkChange("twitter", e.target.value)
                }
                placeholder="Twitter URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                padding: "1.25rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              <label
                htmlFor="youtube"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                <FaYoutube
                  style={{
                    color: "#ff0000",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
                YouTube
              </label>
              <input
                id="youtube"
                type="url"
                value={
                  editedData.socialLinks.find(
                    (link) => link.platform === "youtube"
                  )?.url
                }
                onChange={(e) =>
                  handleSocialLinkChange("youtube", e.target.value)
                }
                placeholder="YouTube URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPageCard;
