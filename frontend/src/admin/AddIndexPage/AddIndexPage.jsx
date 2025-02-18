import React, { useState } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import './AddIndexPage.scss';

const AddIndexPage = ({ flipbookId }) => {
  const [title, setTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { addIndexPage, loading } = useFlipbookStore();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !pageNumber || selectedFiles.length === 0) {
      toast.error('Please fill in all required fields and select at least one image');
      return;
    }

    try {
      const parsedPageNumber = parseInt(pageNumber);
      if (isNaN(parsedPageNumber)) {
        toast.error('Please enter a valid page number');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('pageNumber', parsedPageNumber);
      
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await addIndexPage(flipbookId, formData);
      
      // Reset form after successful submission
      setTitle('');
      setPageNumber('');
      setSelectedFiles([]);
      
      toast.success('Index page added successfully');
    } catch (error) {
      console.error('Error adding index page:', error);
      toast.error(error.message || 'Failed to add index page');
    }
  };

  return (
    <div className="add-index-page">
      <h3>Add Index Page</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Table of Contents"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pageNumber">Page Number *</label>
          <input
            type="number"
            id="pageNumber"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="Enter page number"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Images * (Max 8)</label>
          <input
            type="file"
            id="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="file-input"
            required
          />
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <p>Selected files ({selectedFiles.length}):</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Index Page'}
        </button>
      </form>
    </div>
  );
};

export default AddIndexPage; 