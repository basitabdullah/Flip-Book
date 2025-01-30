import React, { useState, useEffect } from "react";
import "./PublishedFlipbooks.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { Link } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa'; 
const PublishedFlipbooks = () => {
  const {
    getPublishedFlipbooks,
    publishedFlipbooks,
    loading,
    error,
    togglePublishedFlipbook,
  } = useFlipbookStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlipbook, setSelectedFlipbook] = useState(null);

  // Fetch Published Flipbooks
  useEffect(() => {
    getPublishedFlipbooks();
  }, [getPublishedFlipbooks]);

  const handleOpenModal = (flipbook) => {
    setSelectedFlipbook(flipbook);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlipbook(null);
  };

  const handleConfirmToggle = async () => {
    if (selectedFlipbook) {
      await togglePublishedFlipbook(selectedFlipbook._id);
    }
    handleCloseModal();
  };

  return (
    <div className="published-flipbooks">
      <h2>Published Flipbooks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="flipbooks-list">
          {publishedFlipbooks && publishedFlipbooks.length > 0 ? (
            publishedFlipbooks
              .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
              .map((flipbook) => (
                <div key={flipbook._id} className="flipbook-item">
                  <div className="flipbook-info">
                    <span className="flipbook-title">{flipbook.name}</span>
                    <span className="flipbook-title-issue">
                      {flipbook.issue}
                    </span>
                    <span className="flipbook-date">
                      Published on:{" "}
                      {new Date(flipbook.publishedAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }
                      )}
                    </span>
                  </div>
                  <div className="buttons">
                <select
                  className="dropdown-button"
                  value={flipbook.isPublished ? "Publish" : "Unpublish"}
                  onChange={(e) => handleOpenModal(flipbook, e.target.value)}
                >
                  <option value="Unpublish">Unpublish</option>
                  <option value="Publish">Publish</option>
                </select>
                <Link to={`/flipbooks/${flipbook._id}`}>
                  <button className="view-button">View</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(flipbook._id)} // Assuming handleDelete is the delete function
                >
                  <FaTrashAlt /> {/* Trash icon */}
                  Delete
                </button>
              </div>
                </div>
              ))
          ) : (
            <p>No published flipbooks available.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>
              Are you sure you want to{" "}
              {selectedFlipbook?.isPublished ? "unpublish" : "publish"} the
              flipbook "{selectedFlipbook?.name}"?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirmToggle}>
                Yes
              </button>
              <button className="cancel-button" onClick={handleCloseModal}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishedFlipbooks;
