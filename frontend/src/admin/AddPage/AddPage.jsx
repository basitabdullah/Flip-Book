import "./AddPage.scss";
import { useState } from "react";
import useFlipbookStore from "../../stores/useFlipbookStore";

function AddPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState("image");
    const [content, setContent] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [formError, setFormError] = useState("");
    const [uploadMethod, setUploadMethod] = useState("url");
    const [file, setFile] = useState(null);
    const { loading, addPage, flipbook, error } = useFlipbookStore();
  
    const renderContentPreview = () => {
      switch (contentType) {
        case "image":
          if (uploadMethod === "file" && file) {
            return <img src={URL.createObjectURL(file)} alt="Preview" />;
          }
          return content ? (
            <img src={content} alt="Preview" />
          ) : (
            <span>Enter image URL or upload an image</span>
          );
        case "video":
          if (uploadMethod === "file" && file) {
            return (
              <video controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
              </video>
            );
          }
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
            <span>Enter YouTube URL or upload a video</span>
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
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        if (contentType === "image" && !selectedFile.type.startsWith("image/")) {
          setFormError("Please select an image file");
          return;
        }
        if (contentType === "video" && !selectedFile.type.startsWith("video/")) {
          setFormError("Please select a video file");
          return;
        }
        setFile(selectedFile);
        setFormError("");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");
  
      try {
        let finalContent = content;
        
        if (uploadMethod === "file" && file) {
          const formData = new FormData();
          formData.append("file", file);
          
          finalContent = URL.createObjectURL(file);
        }

        await addPage(
          {
            title,
            description,
            content: finalContent,
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
        setFile(null);
        setUploadMethod("url");
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

          {contentType !== "map" && (
            <div className="form-group">
              <label>Upload Method</label>
              <select
                value={uploadMethod}
                onChange={(e) => setUploadMethod(e.target.value)}
              >
                <option value="url">URL</option>
                <option value="file">File Upload</option>
              </select>
            </div>
          )}
  
          <div className="form-group">
            {uploadMethod === "url" ? (
              <>
                <label>Content URL</label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Enter ${contentType} URL`}
                />
              </>
            ) : (
              <>
                <label>Upload File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={contentType === "image" ? "image/*" : "video/*"}
                />
              </>
            )}
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

  export default AddPage;