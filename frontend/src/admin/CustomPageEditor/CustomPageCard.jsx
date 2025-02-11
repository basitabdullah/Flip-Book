import React, { useState } from 'react';
import useCustomPageStore from '../../stores/useCustomPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import './CustomPageCard.scss';
import { toast } from 'react-hot-toast';

const CustomPageCard = ({ pageData = {}, pageNumber, loading, flipbookId }) => {
  const { updateCustomPage, deleteCustomPage } = useCustomPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [images, setImages] = useState(pageData?.images || []);
  const [pagesTitles, setPagesTitles] = useState(pageData?.pagesTitles || []);

  if (!pageData) return null;

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleUpdateImage = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddPageTitle = () => {
    setPagesTitles([...pagesTitles, { title: '', pageNumber: '' }]);
  };

  const handleUpdatePageTitle = (index, field, value) => {
    const updatedEntries = [...pagesTitles];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: field === 'pageNumber' ? (value === '' ? '' : parseInt(value)) : value
    };
    setPagesTitles(updatedEntries);
  };

  const handleRemovePageTitle = (index) => {
    setPagesTitles(pagesTitles.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      if (!flipbookId || !pageNumber) {
        throw new Error('Missing required data');
      }

      const validImages = images.filter(img => img.trim());
      const validPagesTitles = pagesTitles
        .filter(entry => entry.title && entry.pageNumber)
        .map(entry => ({
          ...entry,
          pageNumber: parseInt(entry.pageNumber)
        }));

      await updateCustomPage(flipbookId, pageNumber, {
        title,
        pageNumber,
        images: validImages,
        pagesTitles: validPagesTitles
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deleteCustomPage(flipbookId, pageNumber);
        await getFlipbookById(flipbookId);
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <div className="custom-page-card">
      <div className="card-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="action-buttons">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`edit-btn ${isEditing ? 'active' : ''}`}
          >
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

          <div className="form-section">
            <div className="section-header">
              <h4>Images</h4>
              <button type="button" onClick={handleAddImage} className="add-btn">
                + Add Image
              </button>
            </div>
            {images.map((image, index) => (
              <div key={index} className="image-entry">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleUpdateImage(index, e.target.value)}
                  placeholder="Enter image URL"
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

          <div className="form-section">
            <div className="section-header">
              <h4>Pages List</h4>
              <button type="button" onClick={handleAddPageTitle} className="add-btn">
                + Add Page
              </button>
            </div>
            {pagesTitles.map((entry, index) => (
              <div key={index} className="page-title-entry">
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => handleUpdatePageTitle(index, 'title', e.target.value)}
                  placeholder="Page Title"
                />
                <input
                  type="number"
                  value={entry.pageNumber}
                  onChange={(e) => handleUpdatePageTitle(index, 'pageNumber', e.target.value)}
                  placeholder="Page #"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePageTitle(index)}
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
          
          <div className="images-section">
            <h4>Images</h4>
            <div className="images-grid">
              {images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Image ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pages-list-section">
            <h4>Pages List</h4>
            <div className="pages-list">
              {pagesTitles.map((entry, index) => (
                <div key={index} className="page-entry">
                  <span className="page-title">{entry.title}</span>
                  <span className="page-number">Page {entry.pageNumber}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPageCard; 