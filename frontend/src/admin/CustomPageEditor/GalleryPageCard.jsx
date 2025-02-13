import React, { useState } from 'react';
import useCustomPageStore from '../../stores/useCustomPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import "./CustomPage.scss"

const GalleryPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateCustomPage, deleteCustomPage } = useCustomPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [subtitle, setSubtitle] = useState(pageData?.subtitle || '');
  const [imagesData, setImagesData] = useState(pageData?.imagesData || []);

  const handleAddImage = () => {
    setImagesData([...imagesData, {
      imagesDataTitle: '',
      imagesDataSubtitle: '',
      imagesDataImage: ''
    }]);
  };

  const handleUpdateImageData = (index, field, value) => {
    const updatedImagesData = [...imagesData];
    updatedImagesData[index] = {
      ...updatedImagesData[index],
      [field]: value
    };
    setImagesData(updatedImagesData);
  };

  const handleRemoveImage = (index) => {
    setImagesData(imagesData.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      await updateCustomPage(flipbookId, pageNumber, {
        title,
        pageNumber,
        subtitle,
        imagesData,
        pageType: 'Gallery',
        isCustom: true
      });
      setIsEditing(false);
      toast.success('Gallery page updated successfully');
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deleteCustomPage(flipbookId, pageNumber);
        await getFlipbookById(flipbookId);
        toast.success('Page deleted successfully');
      } catch (error) {
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <div className="page-editor-card gallery-editor">
      <div className="editor-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="action-buttons">
          <button onClick={() => setIsEditing(!isEditing)} className={`edit-btn ${isEditing ? 'active' : ''}`}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <h4>Gallery Images</h4>
              <button type="button" onClick={handleAddImage} className="add-btn">
                + Add Image
              </button>
            </div>
            {imagesData.map((image, index) => (
              <div key={index} className="gallery-entry">
                <input
                  type="text"
                  value={image.imagesDataTitle}
                  onChange={(e) => handleUpdateImageData(index, 'imagesDataTitle', e.target.value)}
                  placeholder="Image Title"
                />
                <input
                  type="text"
                  value={image.imagesDataSubtitle}
                  onChange={(e) => handleUpdateImageData(index, 'imagesDataSubtitle', e.target.value)}
                  placeholder="Image Subtitle"
                />
                <input
                  type="text"
                  value={image.imagesDataImage}
                  onChange={(e) => handleUpdateImageData(index, 'imagesDataImage', e.target.value)}
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleUpdate} className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{title}</h3>
          <h4>{subtitle}</h4>
          <div className="gallery-section">
            <h4>Gallery Images</h4>
            <div className="gallery-grid">
              {imagesData.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image.imagesDataImage} alt={image.imagesDataTitle} />
                  <h5 className="item-title">{image.imagesDataTitle}</h5>
                  <p className="item-subtitle">{image.imagesDataSubtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPageCard; 