import React, { useEffect, useState } from "react";
import "./ArchivedVersion.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { Link } from "react-router-dom";
const ArchivedVersions = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { flipbook, getArchivedVersions, archives } = useFlipbookStore();

  useEffect(() => {
    getArchivedVersions(flipbook._id);
  }, [archives]);

   
  const handlePublishClick = (version) => {
    setSelectedVersion(version);
    setIsModalOpen(true);
  };

  const handleConfirmPublish = () => {
    // Add your publish logic here
    console.log(`Publishing version ${selectedVersion.id}`);
    setIsModalOpen(false);
    setSelectedVersion(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVersion(null);
  };

  return (
    
      <div className="archived-versions">
      <h2>Archived Versions</h2>
      <div className="versions-list">
        {archives && archives.length > 0 ? (
          archives.map((version) => (
            <div key={version._id} className="version-item">
              <div className="version-info">
                <span className="version-date">
                  {new Date(version.archivedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 12-hour format (AM/PM)
                    timeZoneName: "short",
                  })}
                </span>
                <span className="version-title">{version.name}</span>
              </div>
              <div className="buttons">
                <button
                  className="publish-button"
                  onClick={() => handlePublishClick(version)}
                >
                  Publish
                </button>
                <Link to={`/admin/archive-editor/${version._id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>No Archives Available</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPublish}
        title="Confirm Publication"
        message={`Are you sure you want to publish ${selectedVersion?.name}?`}
      />
    </div>
    )
};

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-content">{message}</div>
        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivedVersions;
