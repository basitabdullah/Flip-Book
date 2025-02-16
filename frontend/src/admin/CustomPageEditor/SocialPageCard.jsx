import React, { useState, useEffect } from 'react';
import useSocialPageStore from '../../stores/useSocialPageStore';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import "./SocialPageCard.scss"

const defaultData = {
  title: '',
  subtitle: '',
  street: '',
  city: '',
  postalCode: '',
  phone: '',
  email: '',
  mapUrl: '',
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'youtube', url: 'https://youtube.com' }
  ]
};

const SocialPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateSocialPage, deleteSocialPage } = useSocialPageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(defaultData);

  useEffect(() => {
    if (pageData) {
      setEditedData({
        title: pageData.title || '',
        subtitle: pageData.subtitle || '',
        street: pageData.street || '',
        city: pageData.city || '',
        postalCode: pageData.postalCode || '',
        phone: pageData.phone || '',
        email: pageData.email || '',
        mapUrl: pageData.mapUrl || '',
        socialLinks: pageData.socialLinks || defaultData.socialLinks
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
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditedData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.platform === platform ? { ...link, url: value } : link
      )
    }));
  };

  const handleSave = async () => {
    try {
      await updateSocialPage(flipbookId, pageData._id, {
        ...editedData,
        pageNumber
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating social page:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSocialPage(flipbookId, pageData._id);
    } catch (error) {
      console.error('Error deleting social page:', error);
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
              <FaTimes onClick={() => setIsEditing(false)} className="cancel-icon" />
            </>
          ) : (
            <>
              <FaEdit onClick={() => setIsEditing(true)} className="edit-icon" />
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
                <p>{editedData.city}, {editedData.postalCode}</p>
              </div>

              <div className="field-group">
                <label>Contact</label>
                <p>{editedData.phone}</p>
                <p>{editedData.email}</p>
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
                {editedData.socialLinks.map(link => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform === 'facebook' && <FaFacebook />}
                    {link.platform === 'instagram' && <FaInstagram />}
                    {link.platform === 'twitter' && <FaTwitter />}
                    {link.platform === 'youtube' && <FaYoutube />}
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
              type="number"
              name="postalCode"
              value={editedData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="number"
              name="phone"
              value={editedData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
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

          <div className="social-links">
            <div className="social-input">
              <label htmlFor="facebook">Facebook</label>
              <FaFacebook />
              <input
                id="facebook"
                type="url"
                value={editedData.socialLinks.find(link => link.platform === 'facebook')?.url}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                placeholder="Facebook URL"
              />
            </div>
            <div className="social-input">
              <label htmlFor="instagram">Instagram</label>
              <FaInstagram />
              <input
                id="instagram"
                type="url"
                value={editedData.socialLinks.find(link => link.platform === 'instagram')?.url}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="Instagram URL"
              />
            </div>
            <div className="social-input">
              <label htmlFor="twitter">Twitter</label>
              <FaTwitter />
              <input
                id="twitter"
                type="url"
                value={editedData.socialLinks.find(link => link.platform === 'twitter')?.url}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="Twitter URL"
              />
            </div>
            <div className="social-input">
              <label htmlFor="youtube">YouTube</label>
              <FaYoutube />
              <input
                id="youtube"
                type="url"
                value={editedData.socialLinks.find(link => link.platform === 'youtube')?.url}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                placeholder="YouTube URL"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPageCard; 