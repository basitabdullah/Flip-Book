import React, { useEffect } from "react";
import "./PublishedFlipbooks.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { Link } from "react-router-dom";

const PublishedFlipbooks = () => {
  const {
    getPublishedFlipbooks,
    publishedFlipbook,
    loading,
    error,
    togglePublishedFlipbook,
  } = useFlipbookStore();

  // Fetch Published Flipbooks
  useEffect(() => {
    getPublishedFlipbooks();
  }, [getPublishedFlipbooks]);

  const handleTogglePublish = async (flipbookId) => {
    await togglePublishedFlipbook(flipbookId);
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
          {publishedFlipbook && publishedFlipbook.length > 0 ? (
            publishedFlipbook.map((flipbook) => (
              <div key={flipbook._id} className="flipbook-item">
                <div className="flipbook-info">
                  <span className="flipbook-title">{flipbook.name}</span>
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
                    className={`toggle-button${
                      flipbook.isPublished ? " unpublish" : " publish"
                    }`}
                    onClick={() => handleTogglePublish(flipbook._id)}
                  >
                    {flipbook.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <Link to={`/flipbooks/${flipbook._id}`}>
                    <button className="view-button">View</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No published flipbooks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PublishedFlipbooks;
