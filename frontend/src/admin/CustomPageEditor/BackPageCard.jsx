import React, { useState, useRef, useEffect } from "react";
import useBackCoverStore from "../../stores/useBackCoverStore";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { toast } from "react-hot-toast";
import "./BackPageCard.scss";

const BackPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateBackCover, deleteBackCover } = useBackCoverStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || "");
  const [subtitle, setSubtitle] = useState(pageData?.subtitle || "");
  const [backgroundImage, setBackgroundImage] = useState(pageData?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Update state when pageData changes
  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title || "");
      setSubtitle(pageData.subtitle || "");
      setBackgroundImage(pageData.image || "");
    }
  }, [pageData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);

      // If we have a new image file, append it
      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("pageType", pageData.pageType || "BackPage");
      formData.append("isCustom", "true");

      await updateBackCover(flipbookId, pageData._id, formData);
      setIsEditing(false);
      setImageFile(null);
      toast.success("Back page updated successfully");
      await getFlipbookById(flipbookId);
    } catch (error) {
      toast.error("Failed to update page");
      console.log(error);
      
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        // Make sure we have the page ID
        if (!pageData._id) {
          throw new Error("Page ID is missing");
        }

        await deleteBackCover(flipbookId, pageData._id);
        toast.success("Page deleted successfully");
        await getFlipbookById(flipbookId);
      } catch (error) {
        toast.error("Failed to delete page");
      }
    }
  };

  // If no page data, show a message
  if (!pageData) {
    return <div className="back-page-card error">Invalid page data</div>;
  }

  // Construct the image URL correctly
  const imageUrl = backgroundImage
    ? `${import.meta.env.VITE_BACKEND_URL_UPLOADS}/${backgroundImage}`
    : "";

  return (
    <div className="back-page-card">
      <div className="editor-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="action-buttons">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-btn ${isEditing ? "active" : ""}`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
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
                    src={imageUrl}
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

          <button
            onClick={handleUpdate}
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{title}</h3>
          <h4>{subtitle}</h4>
          <div className="back-page-preview-container">
            {backgroundImage ? (
              <img
                src={imageUrl}
                alt="Background"
                className="back-page-image"
              />
            ) : (
              <div className="no-image-placeholder">
                <p>No background image</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackPageCard;
