import React, { useState } from 'react';
import useReviewsOrMapStore from '../../stores/useReviewsOrMapStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import './AddReviewsOrMapPage.scss';

const AddReviewsOrMapPage = ({ flipbookId }) => {
  const { addReviewsOrMapPage } = useReviewsOrMapStore();
  const { getFlipbookById } = useFlipbookStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    pageNumber: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.title || !formData.pageNumber || !formData.content) {
        throw new Error('Please fill in all required fields');
      }

      // Process content based on type
      let processedContent = formData.content;
      if (formData.contentType === 'map') {
        processedContent = processMapUrl(formData.content);
      } else {
        processedContent = processReviewsUrl(formData.content);
      }

      await addReviewsOrMapPage(flipbookId, {
        title: formData.title,
        pageNumber: parseInt(formData.pageNumber),
        content: processedContent,
        pageType: 'ReviewsOrMap',
        isCustom: true
      });

      // Refresh flipbook data
      await getFlipbookById(flipbookId);

      // Reset form
      setFormData({
        title: '',
        pageNumber: '',
        content: '',
      });

      toast.success('Page added successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processMapUrl = (url) => {
    // Handle Google Maps URLs
    if (url.includes('google.com/maps')) {
      if (url.includes('place/')) {
        // Convert place URL to embed URL
        const placeId = url.split('place/')[1].split('/')[0];
        return `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=place_id:${placeId}`;
      } else if (url.includes('@')) {
        // Convert coordinates URL to embed URL
        const coords = url.split('@')[1].split(',');
        return `https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&center=${coords[0]},${coords[1]}&zoom=${coords[2].split('z')[0]}`;
      }
    }
    return url; // Return as-is if already an embed URL
  };

  const processReviewsUrl = (url) => {
    // Add processing for different review platform URLs if needed
    return url;
  };

  return (
    <div className="add-reviews-map-page">
      <h3>Add Reviews or Map Page</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter page title"
            required
          />
        </div>

        <div className="form-group">
          <label>Page Number</label>
          <input
            type="number"
            name="pageNumber"
            value={formData.pageNumber}
            onChange={handleChange}
            placeholder="Enter page number"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Embed URL</label>
          <input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Paste Google Maps or Reviews embed URL"
            required
          />
          <small className="helper-text">
            Paste the embed URL from Google Maps or your review platform
          </small>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Page'}
        </button>
      </form>
    </div>
  );
};

export default AddReviewsOrMapPage; 