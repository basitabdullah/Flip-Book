import React, { useState } from 'react';
import useBackCoverStore from '../../stores/useBackCoverStore';
import { toast } from 'react-hot-toast';
import './AddBackCover.scss';

const AddBackCover = ({ flipbookId }) => {
  const { addBackCover, loading, error, clearError } = useBackCoverStore();
  const [formData, setFormData] = useState({
    title: '',
    pageNumber: '',
    subtitle: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      if (!selectedImage) {
        throw new Error('Please select an image');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('pageNumber', formData.pageNumber);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('image', selectedImage);

      await addBackCover(flipbookId, formDataToSend);

      // Reset form
      setFormData({
        title: '',
        pageNumber: '',
        subtitle: '',
      });
      setSelectedImage(null);
      setImagePreview(null);

      toast.success('Back cover added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add back cover');
    }
  };

  return (
    <div className="add-back-cover">
      <h3>Add Back Cover</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            required
          />
        </div>

        <div className="form-group">
          <label>Page Number</label>
          <input
            type="number"
            name="pageNumber"
            value={formData.pageNumber}
            onChange={handleInputChange}
            placeholder="Enter page number"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="Enter subtitle"
            required
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Back Cover'}
        </button>
      </form>
    </div>
  );
};

export default AddBackCover; 