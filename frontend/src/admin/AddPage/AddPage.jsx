import "./AddPage.scss";
import { useState } from "react";
import useFlipbookStore  from "../../stores/useFlipbookStore";
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

  export default AddPage