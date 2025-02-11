import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.scss";
import useFlipbookStore from "../../stores/useFlipbookStore"; // Import the Zustand store
import { Link, Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import PublishedFlipbooks from "../PublishedFlipbooks/PublishedFlipbooks";
import ScheduledFlipbooks from "../ScheduledFlipbooks/ScheduledFlipbooks";
import { toast } from 'react-hot-toast';
import FlipbookList from "../FlipbookList/FlipbookList";
import AddPage from "../AddPage/AddPage";
import AddCustomPage from "../AddCustomPage/AddCustomPage";
import CustomPageEditor from "../CustomPageEditor/CustomPageEditor";
import { IoBookOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoGridOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    flipbook,
    getFlipbookById,
    loading,
    error,
    publishFlipbook,
    scheduleFlipbook,
  } = useFlipbookStore();

  // Only show back button if not on the main flipbook list
  const showBackButton = !location.pathname.endsWith('/flipbooks');

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <div className="header">
          <div className="header-content">
            {showBackButton && (
              <button 
                onClick={() => navigate(-1)} 
                className="back-button"
                aria-label="Go back"
              >
                <IoArrowBackOutline />
              </button>
            )}
            <h1>Flipbook Content Manager</h1>
            <div
              className="mobile-menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </div>
          </div>
        </div>

        <Routes>
          <Route
            path="/:id"
            element={
              <FlipbookEditor
                flipbook={flipbook}
                loading={loading}
                error={error}
                publishFlipbook={publishFlipbook}
                scheduleFlipbook={scheduleFlipbook}
                getFlipbookById={getFlipbookById}
              />
            }
          />
          <Route path="/scheduled" element={<ScheduledFlipbooks />} />
          <Route path="/add-page/:id" element={<AddPage />} />
          <Route path="/add-custom-page/:flipbookId" element={<AddCustomPage />} />
          <Route path="/custom-pages/:id" element={<CustomPageEditor />} />
          <Route path="/published" element={<PublishedFlipbooks />} />
          <Route path="/flipbooks" element={<FlipbookList />} />
        </Routes>
      </div>
    </div>
  );
}

function FlipbookEditor({
  flipbook,
  loading,
  error,
  publishFlipbook,
  scheduleFlipbook,
  getFlipbookById
}) {
  const { id } = useParams();

  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [publishName, setPublishName] = useState("");
  const [publishIssueName, setPublishIssueName] = useState("");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    if (id) {
      getFlipbookById(id);
    }
  }, [id, getFlipbookById]);

  const handlePublishFlipbook = async (id, name, issueName) => {
    await publishFlipbook(id, name, issueName);
  };

  const handleSchedulePublish = async () => {
    try {
      if (!publishName || !publishIssueName || !scheduleDate) {
        toast.error("Please fill in all fields");
        return;
      }

      await scheduleFlipbook(
        flipbook._id,
        publishName,
        publishIssueName,
        scheduleDate
      );

      // Reset form
      setPublishName("");
      setPublishIssueName("");
      setScheduleDate(new Date());
      setIsScheduling(false);
    } catch (error) {
      console.error("Failed to schedule flipbook:", error);
    }
  };

  return (
    <>
      <div className="publish-buttons">
        <button onClick={() => setOpenPublishModal(true)} className="action-button primary">
          <IoBookOutline className="icon" />
          Publish New Issue
        </button>
        <div className="divider">|</div>
        <button onClick={() => setIsScheduling(!isScheduling)} className="action-button secondary">
          <IoTimeOutline className="icon" />
          Schedule Publication
        </button>
        <div className="divider">|</div>
        <Link
          to={`/admin/admin-dashboard/add-page/${id}`}
          className="action-button tertiary"
        >
          <IoAddOutline className="icon" />
          Add New Page
        </Link>
        <div className="divider">|</div>
        <Link
          to={`/admin/admin-dashboard/add-custom-page/${id}`}
          className="action-button quaternary animated"
        >
          <IoGridOutline className="icon" />
          Add A Custom Page
        </Link>

        <Link to={`/admin/admin-dashboard/custom-pages/${id}`} className="action-button quaternary animated">
          <IoGridOutline className="icon" />
          Custom Page Editor
        </Link>
      </div>

      {flipbook && (
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
            {(!flipbook.pages || flipbook.pages.length === 0) && (
              <div className="no-pages-state">
                <p>No pages available</p>
                <p>Click "Add New Page" to get started</p>
              </div>
            )}
            {flipbook.pages &&
              flipbook.pages.length > 0 &&
              [...flipbook.pages]
                .filter(page => !page.isCustom && page.pageType !== 'IndexPage')
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((page) => (
                  <PageCard
                    key={`${page._id}-${page.pageNumber}`}
                    pageData={page}
                    pageNumber={page.pageNumber}
                    loading={loading}
                    flipbookId={id}
                  />
                ))}
          </div>
        </>
      )}

      {openPublishModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Publish Flipbook</h2>

            {/* Input for Publish Name */}
            <div className="input-group">
              <label htmlFor="archive-name">Publication Name</label>
              <input
                id="publish-name"
                type="text"
                value={publishName}
                onChange={(e) => setPublishName(e.target.value)}
                placeholder="Enter Publication name"
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
      {isScheduling && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Schedule Publication</h2>

            <div className="input-group">
              <label htmlFor="publication-name">Publication Name</label>
              <input
                id="publication-name"
                type="text"
                value={publishName}
                onChange={(e) => setPublishName(e.target.value)}
                placeholder="Enter publication name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="issue-name">Issue Name</label>
              <input
                id="issue-name"
                type="text"
                value={publishIssueName}
                onChange={(e) => setPublishIssueName(e.target.value)}
                placeholder="Enter issue name"
              />
            </div>

            <div className="input-group">
              <label>Schedule Date & Time (IST)</label>
              <input
                type="datetime-local"
                onChange={(e) => setScheduleDate(e.target.value)}
                value={scheduleDate.toLocaleString('en-CA', {
                  timeZone: 'Asia/Kolkata'
                }).replace(/,/g, '').slice(0, 16)}
                min={new Date().toLocaleString('en-CA', {
                  timeZone: 'Asia/Kolkata'
                }).replace(/,/g, '').slice(0, 16)}
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={handleSchedulePublish}
                className="create-btn"
              >
                Schedule Publication
              </button>
              <button
                onClick={() => setIsScheduling(false)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PageCard({ pageData, pageNumber, loading, flipbookId }) {
  const updatePage = useFlipbookStore((state) => state.updatePage);
  const deletePage = useFlipbookStore((state) => state.deletePage);
  
  console.log("PageData received:", pageData); // Debug log
  
  // Initialize state based on page type
  const [title, setTitle] = useState(pageData?.title || "");
  const [description, setDescription] = useState(pageData?.description || "");
  const [contentType, setContentType] = useState(pageData?.contentType || "");
  const [content, setContent] = useState(pageData?.content || "");
  
  // Add state for index page specific fields
  const [images, setImages] = useState(pageData?.images || []);
  const [pagesTitles, setPagesTitles] = useState(pageData?.pagesTitles || []);

  // Update state when pageData changes
  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title || "");
      setDescription(pageData.description || "");
      setContentType(pageData.contentType || "");
      setContent(pageData.content || "");
      setImages(pageData.images || []);
      setPagesTitles(pageData.pagesTitles || []);
    }
  }, [pageData]);

  const textareaRef = useRef(null);

  const handleUpdate = async () => {
    let updateData;

    // If pageType is not specified, default to 'Page'
    const pageType = pageData.pageType || 'Page';

    if (pageType === 'Page') {
      updateData = {
        title,
        pageNumber,
        pageType: 'Page',
        description,
        content,
        contentType
      };
    } else if (pageType === 'IndexPage') {
      updateData = {
        title,
        pageNumber,
        pageType: 'IndexPage',
        description,
        content,
        contentType,
        images,
        pagesTitles
      };
    }

    try {
      await updatePage(pageData._id, updateData, flipbookId);
    } catch (error) {
      console.error("Failed to update page:", error);
    }
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

  const handleContentChange = (e) => {
    setContent(e.target.value);
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

  // Default to 'Page' type if not specified
  const pageType = pageData.pageType || 'Page';

  return (
    <div className="page-card">
      <div className="page-number">
        Page {pageNumber} ({pageType})
      </div>

      {/* Base fields for all page types */}
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title"
        />
      </div>

      {/* Fields for both Page and IndexPage types */}
      <div className="form-group">
        <label>Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="">Select type</option>
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

      {/* Additional fields only for IndexPage type */}
      {pageType === 'IndexPage' && (
        <>
          <div className="form-group">
            <label>Thumbnail Images</label>
            <textarea
              value={images.join('\n')}
              onChange={(e) => setImages(e.target.value.split('\n').filter(url => url.trim()))}
              placeholder="Enter image URLs (one per line)"
              style={{
                resize: "vertical",
                minHeight: "100px",
              }}
            />
          </div>

          <div className="form-group">
            <label>Pages List</label>
            <div className="pages-titles-list">
              {pagesTitles.map((page, index) => (
                <div key={index} className="page-title-item">
                  <input
                    type="text"
                    value={page.title}
                    onChange={(e) => {
                      const newPagesTitles = [...pagesTitles];
                      newPagesTitles[index].title = e.target.value;
                      setPagesTitles(newPagesTitles);
                    }}
                    placeholder="Page title"
                  />
                  <input
                    type="number"
                    value={page.pageNumber}
                    onChange={(e) => {
                      const newPagesTitles = [...pagesTitles];
                      newPagesTitles[index].pageNumber = parseInt(e.target.value);
                      setPagesTitles(newPagesTitles);
                    }}
                    placeholder="Page number"
                  />
                  <button
                    onClick={() => {
                      const newPagesTitles = pagesTitles.filter((_, i) => i !== index);
                      setPagesTitles(newPagesTitles);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setPagesTitles([...pagesTitles, { title: '', pageNumber: '' }]);
                }}
              >
                Add Page
              </button>
            </div>
          </div>
        </>
      )}

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

function Sidebar({ isOpen, onClose }) {
  const { id } = useParams();

  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="logo">Flipbook Admin</div>
      <nav>
        <Link to="/" className="nav-item">
          <IoHomeOutline className="icon" />
          Home
        </Link>

        <Link to="/admin/admin-dashboard/flipbooks" className="nav-item">
          <IoBookOutline className="icon" />
          Flipbook List
        </Link>

        <Link to="/admin/admin-dashboard/scheduled" className="nav-item">
          <IoTimeOutline className="icon" />
          Scheduled Flipbooks
        </Link>

        <Link to="/admin/admin-dashboard/published" className="nav-item">
          <IoCheckmarkDoneOutline className="icon" />
          Published Versions
        </Link>

        
      </nav>
    </div>
  );
}

export default Dashboard;