import React, { useState } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import './AddIndexPage.scss';

const AddIndexPage = ({ flipbookId }) => {
  const [title, setTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [tableOfContents, setTableOfContents] = useState([]);
  const { addIndexPage, loading } = useFlipbookStore();

  const handleAddTableEntry = () => {
    setTableOfContents([...tableOfContents, { title: '', pageNumber: '' }]);
  };

  const handleUpdateTableEntry = (index, field, value) => {
    const updatedEntries = [...tableOfContents];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setTableOfContents(updatedEntries);
  };

  const handleRemoveTableEntry = (index) => {
    setTableOfContents(tableOfContents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !pageNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const parsedPageNumber = parseInt(pageNumber);
      if (isNaN(parsedPageNumber)) {
        toast.error('Please enter a valid page number');
        return;
      }

      const validTableOfContents = tableOfContents
        .filter(entry => entry.title && entry.pageNumber)
        .map(entry => ({
          ...entry,
          pageNumber: parseInt(entry.pageNumber)
        }));

      await addIndexPage(flipbookId, {
        title,
        pageNumber: parsedPageNumber,
        tableOfContents: validTableOfContents
      });

      setTitle('');
      setPageNumber('');
      setTableOfContents([]);
      toast.success('Index page added successfully');
    } catch (error) {
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

        <div className="table-of-contents">
          <div className="toc-header">
            <h4>Table of Contents</h4>
            <button
              type="button"
              onClick={handleAddTableEntry}
              className="add-entry-btn"
            >
              + Add Entry
            </button>
          </div>

          {tableOfContents.map((entry, index) => (
            <div key={index} className="toc-entry">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => handleUpdateTableEntry(index, 'title', e.target.value)}
                placeholder="Section Title"
              />
              <input
                type="number"
                value={entry.pageNumber}
                onChange={(e) => handleUpdateTableEntry(index, 'pageNumber', e.target.value)}
                placeholder="Page #"
                min="1"
              />
              <button
                type="button"
                onClick={() => handleRemoveTableEntry(index)}
                className="remove-entry-btn"
              >
                ×
              </button>
            </div>
          ))}
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