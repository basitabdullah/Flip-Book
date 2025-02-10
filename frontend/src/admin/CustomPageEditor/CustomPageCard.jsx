import React, { useState } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { IoTrashOutline, IoSaveOutline, IoCreateOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import './CustomPageCard.scss';

const CustomPageCard = ({ pageData = {}, pageNumber, loading, flipbookId }) => {
  const { updateIndexPage, deletePage } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [tableOfContents, setTableOfContents] = useState(pageData?.tableOfContents || []);

  if (!pageData) {
    return null;
  }

  const handleAddEntry = () => {
    setTableOfContents([...tableOfContents, { title: '', pageNumber: '' }]);
  };

  const handleUpdateEntry = (index, field, value) => {
    const updatedEntries = [...tableOfContents];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: field === 'pageNumber' ? (value === '' ? '' : parseInt(value)) : value
    };
    setTableOfContents(updatedEntries);
  };

  const handleRemoveEntry = (index) => {
    setTableOfContents(tableOfContents.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      if (!flipbookId || !pageNumber) {
        throw new Error('Missing required data');
      }

      const validTableOfContents = tableOfContents
        .filter(entry => entry.title && entry.pageNumber)
        .map(entry => ({
          ...entry,
          pageNumber: parseInt(entry.pageNumber)
        }));

      await updateIndexPage(flipbookId, pageNumber, {
        title,
        pageNumber,
        tableOfContents: validTableOfContents
      });

      setIsEditing(false);
      toast.success('Page updated successfully');
    } catch (error) {
      toast.error('Failed to update page');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (!pageData._id || !flipbookId) {
      toast.error('Missing required data for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(pageData._id, flipbookId);
        toast.success('Page deleted successfully');
      } catch (error) {
        toast.error('Failed to delete page');
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className={`custom-page-card ${isEditing ? 'editing' : ''}`}>
      <div className="card-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="action-buttons">
          <button
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            <IoCreateOutline />
          </button>
          {isEditing && (
            <button
              className="save-btn"
              onClick={handleUpdate}
              disabled={loading}
            >
              <IoSaveOutline />
            </button>
          )}
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>

      <div className="card-content">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page Title"
          disabled={!isEditing}
          className="title-input"
        />

        {pageData.pageType === 'index' && (
          <div className="table-of-contents">
            <div className="toc-header">
              <h4>Table of Contents</h4>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAddEntry}
                  className="add-entry-btn"
                >
                  + Add Entry
                </button>
              )}
            </div>

            {tableOfContents.map((entry, index) => (
              <div key={index} className="toc-entry">
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => handleUpdateEntry(index, 'title', e.target.value)}
                  placeholder="Section Title"
                  disabled={!isEditing}
                />
                <input
                  type="number"
                  value={entry.pageNumber}
                  onChange={(e) => handleUpdateEntry(index, 'pageNumber', e.target.value)}
                  placeholder="Page #"
                  min="1"
                  disabled={!isEditing}
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="remove-entry-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPageCard; 