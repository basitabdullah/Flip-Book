import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import ArchivedVersion from "../ArchivedVersions/ArchivedVersion";
import useFlipbookStore from "../../stores/useFlipbookStore"; // Import the Zustand store

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const { flipbook, getFlipbookById, loading, error } = useFlipbookStore();

  useEffect(() => {
    getFlipbookById(""); // No need to pass ID anymore
  }, [getFlipbookById]);

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavClick={(view) => setCurrentView(view)} // Update view on nav click
      />

      <div className="main-content">
        <div className="header">
          <h1>Flipbook Editor</h1>
          <div
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>
        </div>

        {/* Conditionally render components based on currentView */}
        {currentView === "dashboard" && (
          <FlipbookEditor flipbook={flipbook} loading={loading} error={error} />
        )}

        {currentView === "archivedVersions" && <ArchivedVersion />}
      </div>
    </div>
  );
}

function FlipbookEditor({ flipbook, loading, error }) {

  return (
    <>
      <div className="flipbook-editor">
        {loading && <p>Loading flipbook...</p>}
        {error && <p className="error">{error}</p>}
        {flipbook && flipbook.pages ? (
          <>
            {flipbook.pages.length > 0 ? (
              flipbook.pages.map((page, index) => (
                <PageCard
                  key={page._id || index}
                  pageData={page}
                  pageNumber={index + 1}
                  loading={loading}
                />
              ))
            ) : (
              <p>No pages available</p>
            )}
          </>
        ) : (
          <p>No flipbook data available</p>
        )}
      </div>
      <button className="update-all">Update All</button>
    </>
  );
}

function PageCard({ pageData, pageNumber, loading }) {
  const updatePage = useFlipbookStore((state) => state.updatePage);

  const [title, setTitle] = useState(pageData.title || "");
  const [description, setDescription] = useState(pageData.description || "");
  const [contentType, setContentType] = useState("image"); // Default to image
  const [content, setContent] = useState(pageData.content || "");


  const handleUpdate = async () => {
    const updateData = {
      title,
      description,
      content,
      contentType,
      pageNumber
    };

    try {
      await updatePage(pageData._id, updateData);
      // You might want to add some success feedback here
    } catch (error) {
      console.error("Failed to update page:", error);
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
  };

  const renderContent = () => {
    switch (contentType) {
      case "image":
        return content ? (
          <img src={content} alt={`Page ${pageNumber}`} />
        ) : (
          <span>Enter image URL</span>
        );
      case "youtube":
        const youtubeEmbedUrl = getYouTubeEmbedUrl(content);
        return content ? (
          <iframe
            src={youtubeEmbedUrl}
            title={`YouTube video for page ${pageNumber}`}
            frameBorder="0"
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
            width="100%"
            height="100%"
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

  const getGoogleMapEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("google.com/maps/embed")) {
      return url;
    }

    if (url.includes("google.com/maps")) {
      const placeMatch = url.match(/place\/([^\/]+)/);
      const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (placeMatch) {
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${placeMatch[1]}`;
      } else if (coordsMatch) {
        return `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${coordsMatch[1]},${coordsMatch[2]}&zoom=15`;
      }
    }

    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
      url
    )}`;
  };

  return (
    <div className="page-card">
      <div className="page-number">Page {pageNumber}</div>

      <div className="form-group">
        <label>Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="image">Image</option>
          <option value="youtube">YouTube Video</option>
          <option value="map">Map</option>
        </select>
      </div>

      <div className="form-group">
        <label>Content URL</label>
        <input
          type="text"
          value={content}
          onChange={handleContentChange}
          placeholder={`Enter ${contentType} URL`}
        />
      </div>

      <div className={`content-preview ${!content ? "empty" : ""}`}>
        {renderContent()}
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter page description"
        />
      </div>
      <button disabled={loading} className="update-button" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}

function Sidebar({ isOpen, onClose, onNavClick }) {
  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="logo">Flipbook Admin</div>
      <nav>
        <div className="nav-item" onClick={() => onNavClick("dashboard")}>
          <span className="icon">📊</span>
          Dashboard
        </div>
        <div
          className="nav-item"
          onClick={() => onNavClick("archivedVersions")}
        >
          <span className="icon">📄</span>
          Archived Versions
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
