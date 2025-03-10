import React, { useState, useRef, useEffect } from 'react';
import useBackCoverStore from '../../stores/useBackCoverStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import "./BackPageCard.scss";

const BackPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateBackCover, deleteBackCover } = useBackCoverStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [subtitle, setSubtitle] = useState(pageData?.subtitle || '');
  const [backgroundImage, setBackgroundImage] = useState(pageData?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Update state when pageData changes
  useEffect(() => {
    console.log("BackPageCard received pageData:", pageData);
    console.log("pageData.image:", pageData.image);
    
    if (pageData) {
      setTitle(pageData.title || '');
      setSubtitle(pageData.subtitle || '');
      setBackgroundImage(pageData.backgroundImage || '');
    }
  }, [pageData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("Updating back page:", pageData);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('pageNumber', pageNumber);
      
      // If we have a new image file, append it
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (backgroundImage) {
        // Otherwise use the existing image URL
        formData.append('backgroundImage', backgroundImage);
      }
      
      formData.append('pageType', pageData.pageType || 'BackPage');
      formData.append('isCustom', 'true');
      
      console.log("Updating back page with form data");
      
      await updateBackCover(flipbookId, pageNumber, formData);
      setIsEditing(false);
      setImageFile(null);
      toast.success('Back page updated successfully');
      await getFlipbookById(flipbookId);
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update page: ' + (typeof error === 'string' ? error : 'Unknown error'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        console.log("Deleting back page:", pageData);
        await deleteBackCover(flipbookId, pageNumber);
        toast.success('Page deleted successfully');
        await getFlipbookById(flipbookId);
      } catch (error) {
        console.error("Delete error:", error);
        toast.error('Failed to delete page: ' + (typeof error === 'string' ? error : 'Unknown error'));
      }
    }
  };

  // If no page data, show a message
  if (!pageData) {
    return <div className="back-page-card error">Invalid page data</div>;
  }

  return (
    <div className="back-page-card">
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

          <div className="form-group">
            <label>Background Image</label>
            <div className="image-input-container">
              {backgroundImage && (
                <div className="current-image">
                  <img 
                    src={import.meta.env.VITE_BACKEND_URL_UPLOADS +"/"+ backgroundImage} 
                    alt="Current background" 
                    className="thumbnail"
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
              {imageFile && (
                <div className="selected-file">
                  <span>{imageFile.name}</span>
                  <button 
                    className="clear-file" 
                    onClick={() => setImageFile(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={handleUpdate} className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{title}</h3>
          <h4>{subtitle}</h4>
          <div 
            className="back-page-preview"
            style={{ backgroundImage: import.meta.env.VITE_BACKEND_URL_UPLOADS +"/"+ backgroundImage ? `url(${import.meta.env.VITE_BACKEND_URL_UPLOADS +"/"+ backgroundImage})` : 'none' }}
          >
            {!backgroundImage && <p className="no-image">No background image</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackPageCard; 