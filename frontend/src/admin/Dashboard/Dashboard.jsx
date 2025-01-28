import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.scss";
import ArchivedVersion from "../ArchivedVersions/ArchivedVersion";
import useFlipbookStore from "../../stores/useFlipbookStore"; // Import the Zustand store
import { Link } from "react-router-dom";
import PublishedFlipbooks from "../PublishedFlipbooks/PublishedFlipbooks";
function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("InstantEditor");
  const {
    flipbook,
    getFlipbookById,
    loading,
    error,
    createArchive,
    publishFlipbook,
  } = useFlipbookStore();

  useEffect(() => {
    getFlipbookById(""); // No need to pass ID anymore
  }, [getFlipbookById]);

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavClick={(view) => setCurrentView(view)}
      />

      <div className="main-content">
        <div className="header">
          <h1>Instant Flipbook Editor</h1>
          <div
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>
        </div>

        {/* Conditionally render components based on currentView */}
        {currentView === "InstantEditor" && (
          <FlipbookEditor
            flipbook={flipbook}
            loading={loading}
            error={error}
            createArchive={createArchive}
            publishFlipbook={publishFlipbook}
          />
        )}

        {currentView === "archivedVersions" && <ArchivedVersion />}
        {currentView === "addPage" && <AddPage />}
        {currentView === "publishedFlipbooks" && <PublishedFlipbooks />}
      </div>
    </div>
  );
}

function FlipbookEditor({
  flipbook,
  loading,
  error,
  createArchive,
  publishFlipbook,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [archiveName, setArchiveName] = useState("");
  const [archiveVersion, setArchiveVersion] = useState("");
  const [publishName, setPublishName] = useState("");
  const [publishIssueName, setPublishIssueName] = useState("");
  const handleCreateArchive = async () => {
    if (!archiveName || !archiveVersion) {
      alert("Please fill in both name and version fields.");
      return;
    }
    await createArchive(flipbook._id, {
      name: archiveName,
      version: archiveVersion,
    });
    setOpenModal(false); // Close the modal after creating the archive
    setArchiveName(""); // Reset the name field
    setArchiveVersion(""); // Reset the version field
  };

  const handlePublishFlipbook = async (id, name, issueName) => {
    console.log(issueName);
    await publishFlipbook(id, name, issueName);
    
  };

  return (
    <>
      <div className="flipbook-editor">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading flipbook...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        )}
        {flipbook && flipbook.pages ? (
          <>
            {flipbook.pages.length > 0 ? (
              [...flipbook.pages]
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((page) => (
                  <PageCard
                    key={page._id}
                    pageData={page}
                    pageNumber={page.pageNumber}
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

      <div className="publish-buttons">
        <button onClick={() => setOpenPublishModal(true)} className="publish">
          Instant Publish
        </button>
        <p>or</p>
        <button onClick={() => setOpenModal(true)} className="create-archive">
          Create an Archive
        </button>
      </div>
      {openPublishModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Publish Flipbook</h2>

            {/* Input for Publish Name */}
            <div className="input-group">
              <label htmlFor="archive-name">Publish Name</label>
              <input
                id="publish-name"
                type="text"
                value={publishName}
                onChange={(e) => setPublishName(e.target.value)}
                placeholder="Enter publish name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="publish-name">Issue Name</label>
              <input
                id="publish-name"
                type="text"
                value={publishIssueName}
                onChange={(e) => setPublishIssueName(e.target.value)}
                placeholder="Enter issue name"
              />
            </div>

            {/* Buttons */}
            <div className="modal-actions">
              <button
                onClick={() => handlePublishFlipbook(flipbook._id, publishName, publishIssueName)}
                className="create-btn"
              >
                Publish
              </button>
              <button
                onClick={() => setOpenPublishModal(false)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Archive</h2>

            {/* Input for Archive Name */}
            <div className="input-group">
              <label htmlFor="archive-name">Archive Name</label>
              <input
                id="archive-name"
                type="text"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                placeholder="Enter archive name"
              />
            </div>

            {/* Input for Archive Version */}
            <div className="input-group">
              <label htmlFor="archive-version">Archive Version</label>
              <input
                id="archive-version"
                type="text"
                value={archiveVersion}
                onChange={(e) => setArchiveVersion(e.target.value)}
                placeholder="Enter archive version"
              />
            </div>

            {/* Buttons */}
            <div className="modal-actions">
              <button onClick={handleCreateArchive} className="create-btn">
                Create Archive
              </button>
              <button onClick={() => setOpenModal(false)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PageCard({ pageData, pageNumber, loading }) {
  const updatePage = useFlipbookStore((state) => state.updatePage);
  const deletePage = useFlipbookStore((state) => state.deletePage);
  const [title, setTitle] = useState(pageData.title || "");
  const [description, setDescription] = useState(pageData.description || "");
  const [contentType, setContentType] = useState(pageData.contentType || "");
  const [content, setContent] = useState(pageData.content || "");

  const textareaRef = useRef(null);

  const handleUpdate = async () => {
    const updateData = {
      title,
      description,
      content,
      contentType,
      pageNumber,
    };

    try {
      await updatePage(pageData._id, updateData);
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
      case "video":
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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deletePage(pageData._id);
      } catch (error) {
        console.error("Failed to delete page:", error);
      }
    }
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
          <option value="video">YouTube Video</option>
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
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter page description"
          style={{
            resize: "vertical",
            minHeight: "100px",
          }}
        />
      </div>
      <div className="button-group">
        <button
          disabled={loading}
          className="update-button"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          disabled={loading}
          className="delete-button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function AddPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("image");
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [formError, setFormError] = useState("");
  const { loading, addPage, flipbook, error } = useFlipbookStore();

  const renderContentPreview = () => {
    switch (contentType) {
      case "image":
        return content ? (
          <img src={content} alt="Preview" />
        ) : (
          <span>Enter image URL</span>
        );
      case "video":
        const youtubeEmbedUrl = getYouTubeEmbedUrl(content);
        return content ? (
          <iframe
            src={youtubeEmbedUrl}
            title="YouTube video preview"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await addPage(
        {
          title,
          description,
          content,
          contentType,
          pageNumber: parseInt(pageNumber) || undefined,
        },
        flipbook._id
      );

      setTitle("");
      setDescription("");
      setContent("");
      setPageNumber("");
      setContentType("image");
    } catch (error) {
      setFormError(error);
    }
  };

  return (
    <div className="add-page">
      <h2>Add New Page</h2>
      {formError && <div className="error-message">{formError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Page Number</label>
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="Enter page number"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Enter ${contentType} URL`}
          />
        </div>

        <div className="content-preview">{renderContentPreview()}</div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter page description"
            style={{
              resize: "vertical",
              minHeight: "100px",
            }}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Adding..." : "Add Page"}
        </button>
      </form>
    </div>
  );
}

function Sidebar({ isOpen, onClose, onNavClick }) {
  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="logo">Flipbook Admin</div>
      <nav>
        <Link to="/" className="nav-item">
          <span className="icon">🏠</span>
          Home
        </Link>
        <div className="nav-item" onClick={() => onNavClick("InstantEditor")}>
          <span className="icon">📊</span>
          Instant Editor
        </div>

        <div className="nav-item" onClick={() => onNavClick("addPage")}>
          <span className="icon">➕</span>
          Add Page
        </div>
        <div
          className="nav-item"
          onClick={() => onNavClick("archivedVersions")}
        >
          <span className="icon">📄</span>
          Archived Versions
        </div>
        <div
          className="nav-item"
          onClick={() => onNavClick("publishedFlipbooks")}
        >
          <span className="icon">⚠️</span>
          Published Versions
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
