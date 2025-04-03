import React, { useState, useEffect } from "react";
import useFlipbookStore from "../../stores/useFlipbookStore";
import "./FlipbookList.scss";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const FlipbookList = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const {
    flipbooks,
    getFlipbooks,
    createFlipbook,
    deleteFlipbook,
    loading,
    error,
  } = useFlipbookStore();

  useEffect(() => {
    getFlipbooks();
  }, [getFlipbooks]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateFlipbook = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createFlipbook(formData);
      setName(""); // Reset name
      setImageFile(null); // Reset image file
      setImagePreview(""); // Reset image preview
    } catch (error) {
      console.error("Failed to create flipbook:", error);
    }
  };

  const handleDeleteFlipbook = async (flipbookId) => {
    if (window.confirm("Are you sure you want to delete this flipbook?")) {
      try {
        await deleteFlipbook(flipbookId);
      } catch (error) {
        console.error("Failed to delete flipbook:", error);
      }
    }
  };

  return (
    <div className="flipbook-list">
      <h2>All Flipbooks</h2>

      {/* Create Flipbook Form */}
      <div className="create-flipbook-form">
        <h3>Create New Flipbook</h3>
        <div className="form-inputs">
          <label htmlFor="name">Flipbook Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter flipbook name"
          />

          <label htmlFor="image">Cover Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCreateFlipbook}
          className="create-flipbook-btn"
          disabled={!name || !imageFile}
        >
          Create Flipbook
        </button>
      </div>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Error State */}
      {error && <div className="error-message">{error}</div>}

      {/* Flipbook Grid */}
      {!loading && !error && (
        <div className="flipbook-grid">
          {flipbooks &&
            flipbooks.map((flipbook) => (
              <div key={flipbook._id} className="flipbook-card">
                {/* Flipbook Image */}
                {flipbook.image && (
                  <div className="flipbook-image">
                    <img src={`${import.meta.env.VITE_BACKEND_URL_UPLOADS+"/"+flipbook.image}`} alt={flipbook.name}/>
                  </div>
                )}

                <h3>{flipbook.name}</h3>
                <div className="flipbook-stats">
                  <span>{flipbook.pages?.length || 0} pages</span>
                </div>
                <div className="flipbook-actions">
                  <Link
                    to={`/admin/admin-dashboard/${flipbook._id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteFlipbook(flipbook._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FlipbookList;
