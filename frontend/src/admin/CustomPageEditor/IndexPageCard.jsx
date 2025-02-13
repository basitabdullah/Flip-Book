import React, { useState } from 'react';
import useCustomPageStore from '../../stores/useCustomPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import "./CustomPage.scss";

const IndexPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateCustomPage, deleteCustomPage } = useCustomPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [images, setImages] = useState(pageData?.images || []);
  const [pagesTitles, setPagesTitles] = useState(pageData?.pagesTitles || []);

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
      await updateCustomPage(flipbookId, pageNumber, {
        title,
        pageNumber,
        images,
        pagesTitles,
        pageType: 'IndexPage',
        isCustom: true
      });
      setIsEditing(false);
      toast.success('Index page updated successfully');
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
    <div className="page-editor-card index-editor">
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

          <div className="form-section">
            <div className="section-header">
              <h4>Thumbnail Images</h4>
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
              <div key={index} className="index-entry">
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
          <div className="thumbnails-section">
            <h4>Thumbnail Images</h4>
            <div className="thumbnails-grid">
              {images.map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="index-list">
            {pagesTitles.map((entry, index) => (
              <div key={index} className="index-item">
                <span className="item-title">{entry.title}</span>
                <span className="item-number">Page {entry.pageNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPageCard; 