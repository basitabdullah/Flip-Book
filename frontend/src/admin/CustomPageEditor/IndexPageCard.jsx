import React, { useState } from "react";
import useIndexPageStore from "../../stores/useIndexPageStore";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { toast } from "react-hot-toast";

const IndexPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateIndexPage, deleteIndexPage } = useIndexPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || "");
  const [images, setImages] = useState(pageData?.images || []);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pageNumber", pageNumber);
      formData.append("pageType", "IndexPage");
      formData.append("isCustom", true);

      // Append existing images if no new files selected
      if (selectedFiles.length === 0) {
        images.forEach((image) => {
          formData.append("existingImages", image);
        });
      } else {
        // Append new files
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      await updateIndexPage(flipbookId, pageNumber, formData);
      setIsEditing(false);
      setSelectedFiles([]);
      toast.success("Index page updated successfully");
    } catch (error) {
      toast.error("Failed to update page");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deleteIndexPage(flipbookId, pageNumber);
        await getFlipbookById(flipbookId);
        toast.success("Page deleted successfully");
      } catch (error) {
        toast.error("Failed to delete page");
      }
    }
  };

  return (
    <div className="index-card">
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

          <div className="form-section">
            <div className="section-header">
              <h4>Images (Max 8)</h4>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="file-input"
            />
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <p>Selected new files ({selectedFiles.length}):</p>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedFiles.length === 0 && (
              <div className="current-images">
                <p>Current images:</p>
                <div className="thumbnails-grid">
                  {images.map((image, index) => (
                    <div key={index} className="thumbnail">
                      <img
                        style={{
                          maxWidth: "280px",
                          objectFit: "contain",
                        }}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <div className="thumbnails-section">
            <h4>Images</h4>
            <div className="thumbnails-grid">
              {images.map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPageCard;
