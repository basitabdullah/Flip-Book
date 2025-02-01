import React, { useState, useEffect } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import './FlipbookList.scss';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const FlipbookList = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const { 
    flipbooks,
    getFlipbooks,
    createFlipbook,
    loading,
    error 
  } = useFlipbookStore();

  useEffect(() => {
    getFlipbooks();
  }, [getFlipbooks]);
  

  const handleCreateFlipbook = async () => {
    try {
      // Pass name and image to createFlipbook
      await createFlipbook(name, image);
      setName(''); // Reset name
      setImage(''); // Reset image
    } catch (error) {
      console.error('Failed to create flipbook:', error);
    }
  };

  return (
    <div className="flipbook-list">
      <h2>All Flipbooks</h2>

      {/* Create Flipbook Form */}
      <div className="create-flipbook-form">
        <h3>Create New Flipbook</h3>
        <div className="form-inputs">
          <label htmlFor="name">Flipbook Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter flipbook name"
          />

          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <button 
          onClick={handleCreateFlipbook}
          className="create-flipbook-btn"
        >
          Create Flipbook
        </button>
      </div>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Error State */}
      {error && <div className="error-message">{error}</div>}

      {/* Flipbook Grid */}
      {!loading && !error && (
        <div className="flipbook-grid">
          {flipbooks && flipbooks.map((flipbook) => (
            <div key={flipbook._id} className="flipbook-card">
              {/* Flipbook Image */}
              {flipbook.image && (
                <div className="flipbook-image">
                  <img 
                    src={flipbook.image} 
                    alt={flipbook.name} 
                  />
                </div>
              )}

              <h3>{flipbook.name}</h3>
              <div className="flipbook-stats">
                <span>{flipbook.pages?.length || 0} pages</span>
              </div>
              <div className="flipbook-actions">
                <Link 
                  to={`/admin/admin-dashboard/${flipbook._id}`} 
                  className="edit-btn"
                >
                  Edit
                </Link>
                
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlipbookList;