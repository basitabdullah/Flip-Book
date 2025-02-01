import React, { useState, useEffect } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import './FlipbookList.scss';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const FlipbookList = () => {
  const [openModal, setOpenModal] = useState(false);
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
      await createFlipbook();
      setOpenModal(false);
    } catch (error) {
      console.error('Failed to create flipbook:', error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="flipbook-list-container">
      <h2>Flipbooks</h2>
      
      <div className="flipbooks-grid">
        {flipbooks && flipbooks.map((flipbook) => (
          <Link 
            to={`/admin/flipbook/${flipbook._id}`} 
            key={flipbook._id} 
            className="flipbook-card"
          >
            <div className="flipbook-info">
              <h3>Flipbook {flipbook.currentVersion}</h3>
              <p>Pages: {flipbook.pages.length}</p>
              <p>Created: {new Date(flipbook.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>

      <button 
        className="create-flipbook-btn"
        onClick={() => setOpenModal(true)}
      >
        Create New Flipbook
      </button>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Flipbook</h3>
            <p>Are you sure you want to create a new flipbook?</p>
            
            <div className="modal-actions">
              <button 
                onClick={handleCreateFlipbook}
                className="confirm-btn"
              >
                Create
              </button>
              <button 
                onClick={() => setOpenModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlipbookList;