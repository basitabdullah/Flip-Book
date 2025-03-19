import React, { useState, useEffect } from 'react';
import useReviewsOrMapStore from '../../stores/useReviewsOrMapStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import "./ReviewsOrMapPageCard.scss";

const ReviewsOrMapPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateReviewsOrMapPage, deleteReviewsOrMapPage } = useReviewsOrMapStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [content, setContent] = useState(pageData?.content || '');

  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title || '');
      setContent(pageData.content || '');
    }
  }, [pageData]);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        title,
        pageNumber,
        content,
        pageType: 'ReviewsOrMap',
        isCustom: true,
        _id: pageData._id
      };

      await updateReviewsOrMapPage(flipbookId, pageData._id, updatedData);
      await getFlipbookById(flipbookId);
      setIsEditing(false);
      // toast.success('Reviews/Map page updated successfully');
    } catch (error) {
      toast.error('Failed to update page');
      
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deleteReviewsOrMapPage(flipbookId, pageData._id);
        await getFlipbookById(flipbookId);
        toast.success('Page deleted successfully');
      } catch (error) {
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <div className="reviews-map-card">
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
            <label>Embed URL</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter Google Maps or Reviews embed URL"
            />
            <small className="helper-text">
              Paste the embed URL from Google Maps or your review platform
            </small>
          </div>

          <button onClick={handleUpdate} className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{title}</h3>
          <div className="content-preview">
            <iframe
              src={content}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsOrMapPageCard; 