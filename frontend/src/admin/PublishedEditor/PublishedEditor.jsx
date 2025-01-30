import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFlipbookStore from '../../stores/useFlipbookStore';
import './PublishedEditor.scss';
import Loader from '../../components/Loader/Loader';
const PublishedEditor = () => {
  const { flipbookId } = useParams();
  const [currentPage, setCurrentPage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const {
    getPublishedFlipbook,
    updatePublishedFlipbook,
    publishedFlipbook,
    loading,
    error
  } = useFlipbookStore();

  useEffect(() => {
    if (flipbookId) {
      getPublishedFlipbook(flipbookId);
    }
  }, [flipbookId, getPublishedFlipbook]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEditMode(false);
  };

  const handleUpdatePage = async (pageData) => {
    try {
      await updatePublishedFlipbook(flipbookId, currentPage._id, pageData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    let videoId = "";
    const watchUrlMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    );
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const renderContent = (contentType, content) => {
    switch (contentType) {
      case "image":
        return content ? (
          <img src={content} alt="Page content" className="content-preview-item" />
        ) : (
          <span>Enter image URL</span>
        );
      case "video":
        const youtubeEmbedUrl = getYouTubeEmbedUrl(content);
        return content ? (
          <iframe
            src={youtubeEmbedUrl}
            title="YouTube video"
            frameBorder="0"
            className="content-preview-item"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <span>Enter YouTube URL</span>
        );
      case "map":
        return content ? (
          <iframe
            src={content}
            title="Google Map"
            className="content-preview-item"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <span>Paste Google Maps embed code URL here</span>
        );
      default:
        return <span>Select content type</span>;
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!publishedFlipbook) return <div>No flipbook found</div>;


  return (
    <div className="published-editor">
      <div className="editor-header">
        <h2>{publishedFlipbook.name}</h2>
        <p>Issue: {publishedFlipbook.issue}</p>
      </div>

      <div className="editor-content">
        <div className="page-list">
          {publishedFlipbook.pages.map((page) => (
            <div
              key={page._id}
              className={`page-item ${currentPage?._id === page._id ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              Page {page.pageNumber}
            </div>
          ))}
        </div>

        <div className="page-editor">
          {currentPage ? (
            <>
              {editMode ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Content Type</label>
                    <select
                      value={currentPage.contentType}
                      onChange={(e) => setCurrentPage({
                        ...currentPage,
                        contentType: e.target.value
                      })}
                    >
                      <option value="image">Image</option>
                      <option value="video">YouTube Video</option>
                      <option value="map">Map</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Content URL</label>
                    <input
                      type="text"
                      value={currentPage.content}
                      onChange={(e) => setCurrentPage({
                        ...currentPage,
                        content: e.target.value
                      })}
                      placeholder={`Enter ${currentPage.contentType} URL`}
                    />
                  </div>

                  <div className="content-preview">
                    {renderContent(currentPage.contentType, currentPage.content)}
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={currentPage.title}
                      onChange={(e) => setCurrentPage({
                        ...currentPage,
                        title: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={currentPage.description || ''}
                      onChange={(e) => setCurrentPage({
                        ...currentPage,
                        description: e.target.value
                      })}
                    />
                  </div>

                  <div className="edit-buttons">
                    <button onClick={() => handleUpdatePage(currentPage)}>
                      Save Changes
                    </button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="page-view">
                  <h3>{currentPage.title}</h3>
                  <div className="content-preview">
                    {renderContent(currentPage.contentType, currentPage.content)}
                  </div>
                  <div className="page-content">{currentPage.description}</div>
                  <button onClick={() => setEditMode(true)}>Edit Page</button>
                </div>
              )}
            </>
          ) : (
            <div className="no-page-selected">
              Select a page to view or edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishedEditor; 