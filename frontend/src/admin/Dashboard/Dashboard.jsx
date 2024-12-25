import React, { useState } from "react";

import "./Dashboard.scss";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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


        <div className="flipbook-editor">
          {[...Array(12)].map((_, index) => (
            <PageCard key={index} pageNumber={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageCard({ pageNumber }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="page-card">
      <div className="page-number">Page {pageNumber}</div>

      <div
        className={`image-preview ${!image ? "empty" : ""}`}
        onClick={() =>
          document.getElementById(`file-upload-${pageNumber}`).click()
        }
      >
        {image ? (
          <img src={image} alt={`Page ${pageNumber}`} />
        ) : (
          <span>Click to upload image</span>
        )}
        <input
          id={`file-upload-${pageNumber}`}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
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

      <div className="form-group">
        <label>Tags</label>
        <form onSubmit={addTag}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Type and press Enter to add tag"
          />
        </form>
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button onClick={() => removeTag(tag)} title="Remove tag">
                ×
              </button>
            </span>
          ))}
        </div>
        <button  className="update-button">Update</button>
      </div>
    </div>
  );
}

function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="logo">Flipbook Admin</div>
      <nav>
        <div className="nav-item active">
          <span className="icon">📊</span>
          Dashboard
        </div>
        <div className="nav-item">
          <span className="icon">📄</span>
          Pages
        </div>
        <div className="nav-item">
          <span className="icon">🖼️</span>
          Media Library
        </div>
        <div className="nav-item">
          <span className="icon">⚙️</span>
          Settings
        </div>
      </nav>
    </div>
  );
}
export default Dashboard;
