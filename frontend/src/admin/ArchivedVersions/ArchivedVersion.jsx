import React, { useState } from "react";
import "./ArchivedVersion.scss";

const ArchivedVersions = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with your actual data
  const archivedVersions = [
    { id: 1, date: "2024-03-15", title: "Flipbook Edition v1" },
    { id: 2, date: "2024-03-10", title: "Flipbook Edition v2" },
    { id: 3, date: "2024-03-05", title: "Flipbook Edition v3" },
  ];

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
        {archivedVersions.map((version) => (
          <div key={version.id} className="version-item">
            <div className="version-info">
              <span className="version-date">{version.date}</span>
              <span className="version-title">{version.title}</span>
            </div>
            <div className="buttons">
            <button
              className="publish-button"
              onClick={() => handlePublishClick(version)}
            >
              Publish
            </button>
            <button
              className="edit-button"
            >
              Edit
            </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPublish}
        title="Confirm Publication"
        message={`Are you sure you want to publish ${selectedVersion?.title}?`}
      />
    </div>
  );
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
