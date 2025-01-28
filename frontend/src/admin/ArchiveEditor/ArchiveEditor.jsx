import React, { useEffect , useState} from "react";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { useParams } from "react-router-dom";
import { useRef } from "react";
function ArchiveEditor() {
  const { getArchivedVersionById, loading, error, archives } =
    useFlipbookStore();
  const { archiveId } = useParams();

  useEffect(() => {
    getArchivedVersionById(archiveId);
  }, [archiveId]);

  return (
    <>
      <div className="flipbook-editor">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading archive...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        )}
        {archives && archives.pages ? (
          archives.pages.map((pageData, index) => (
            <PageCard key={index} pageData={pageData} pageNumber={index + 1} />
          ))
        ) : (
          <p>No archive data available</p>
        )}
      </div>
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
          //   onClick={handleUpdate}
        >
          Update
        </button>
        <button
          disabled={loading}
          className="delete-button"
          //   onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ArchiveEditor;
