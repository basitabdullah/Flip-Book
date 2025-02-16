import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSocialPageStore from '../../stores/useSocialPageStore';
import './AddSocialPage.scss';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AddSocialPage = () => {
  const { flipbookId } = useParams();
  const { addSocialPage, loading } = useSocialPageStore();
  const [showMapPreview, setShowMapPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    pageNumber: '',
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
  });

  useEffect(() => {
    // Show map preview only if mapUrl is valid
    if (formData.mapUrl && formData.mapUrl.includes('google.com/maps')) {
      setShowMapPreview(true);
    } else {
      setShowMapPreview(false);
    }
  }, [formData.mapUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.platform === platform ? { ...link, url: value } : link
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pageNumber) {
      toast.error('Page number is required');
      return;
    }

    try {
      await addSocialPage(flipbookId, {
        ...formData,
        pageNumber: parseInt(formData.pageNumber)
      });
      toast.success('Social page added successfully');
      // Reset form after successful submission
      setFormData({
        title: '',
        pageNumber: '',
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
      });
    } catch (error) {
      toast.error(error.message || 'Error adding social page');
    }
  };

  const getEmbedUrl = (mapUrl) => {
    // Convert Google Maps URL to embed URL
    if (mapUrl.includes('google.com/maps')) {
      if (mapUrl.includes('place/')) {
        // Handle place URLs
        const placeId = mapUrl.split('place/')[1].split('/')[0];
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${placeId}`;
      } else if (mapUrl.includes('@')) {
        // Handle coordinate URLs
        const coords = mapUrl.split('@')[1].split(',');
        return `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${coords[0]},${coords[1]}&zoom=${coords[2].split('z')[0]}`;
      }
    }
    return mapUrl;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-social-page">
      <h2>Add Social Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="pageNumber"
            value={formData.pageNumber}
            onChange={handleChange}
            placeholder="Page Number"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            required
            min="0"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            min="0"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-section">
          <h3>Location Details</h3>
          <div className="form-group">
            <input
              type="url"
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              placeholder="Google Maps URL"
              required
            />
          </div>
          {showMapPreview && (
            <div className="map-preview">
              <iframe
                src={getEmbedUrl(formData.mapUrl)}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map Preview"
              ></iframe>
            </div>
          )}
        </div>
        <div className="social-links">
          <div className="social-input">
            <FaFacebook />
            <input
              type="url"
              value={formData.socialLinks.find(link => link.platform === 'facebook')?.url}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              placeholder="Facebook URL"
            />
          </div>
          <div className="social-input">
            <FaInstagram />
            <input
              type="url"
              value={formData.socialLinks.find(link => link.platform === 'instagram')?.url}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              placeholder="Instagram URL"
            />
          </div>
          <div className="social-input">
            <FaTwitter />
            <input
              type="url"
              value={formData.socialLinks.find(link => link.platform === 'twitter')?.url}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="Twitter URL"
            />
          </div>
          <div className="social-input">
            <FaYoutube />
            <input
              type="url"
              value={formData.socialLinks.find(link => link.platform === 'youtube')?.url}
              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
              placeholder="YouTube URL"
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Social Page'}
        </button>
      </form>
    </div>
  );
};

export default AddSocialPage; 