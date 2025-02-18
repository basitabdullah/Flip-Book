import React, { useState, useEffect } from "react";
import "./PublishedFlipbooks.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
const PublishedFlipbooks = () => {
  const {
    getPublishedFlipbooks,
    publishedFlipbooks,
    loading,
    error,
    togglePublishedFlipbook,
    deletePublishedFlipbook,
  } = useFlipbookStore();

  const navigate = useNavigate();

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

  const handleViewFlipbook = (flipbookId) => {
    navigate(`/published-editor/${flipbookId}`);
  };

  const handleDelete = async (flipbookId) => {
    if (
      window.confirm("Are you sure you want to delete this published flipbook?")
    ) {
      try {
        await deletePublishedFlipbook(flipbookId);
        // The store will automatically update the UI
      } catch (error) {
        console.error("Failed to delete published flipbook:", error);
      }
    }
  };

  return (
    <div className="published-flipbooks">
      <h2>Published Flipbooks</h2>
      {loading ? (
        <Loader />
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
                    <button
                      className="dropdown-button"
                      onClick={() =>
                        handleOpenModal(
                          flipbook,
                          flipbook.isPublished ? "Unpublish" : "Publish"
                        )
                      }
                    >
                      {flipbook.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    {/* <button
                      className="view-button"
                      onClick={() => handleViewFlipbook(flipbook._id)}
                    >
                      <FaEdit /> Edit
                    </button> */}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(flipbook._id)}
                    >
                      <FaTrashAlt />
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
