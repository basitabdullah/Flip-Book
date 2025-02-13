import React, { useState } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import './AddGalleryPage.scss';

const AddGalleryPage = ({ flipbookId }) => {
  const [title, setTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imagesData, setImagesData] = useState([
    {
      imagesDataTitle: '',
      imagesDataSubtitle: '',
      imagesDataImage: ''
    }
  ]);
  
  const { addGalleryPage, loading, getFlipbookById } = useFlipbookStore();

  const handleAddImage = () => {
    setImagesData([
      ...imagesData,
      {
        imagesDataTitle: '',
        imagesDataSubtitle: '',
        imagesDataImage: ''
      }
    ]);
  };

  const handleUpdateImage = (index, field, value) => {
    const updatedImages = [...imagesData];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    setImagesData(updatedImages);
  };

  const handleRemoveImage = (index) => {
    if (imagesData.length > 1) {
      setImagesData(imagesData.filter((_, i) => i !== index));
    } else {
      toast.error('At least one image is required');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !pageNumber || !subtitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate that all images have required fields
    const isValidImages = imagesData.every(img => 
      img.imagesDataTitle && 
      img.imagesDataSubtitle && 
      img.imagesDataImage
    );

    if (!isValidImages) {
      toast.error('Please fill in all image details');
      return;
    }

    try {
      const parsedPageNumber = parseInt(pageNumber);
      if (isNaN(parsedPageNumber)) {
        toast.error('Please enter a valid page number');
        return;
      }

      // Call the store method with the correct data structure including pageType
      await addGalleryPage(flipbookId, {
        pageType: 'Gallery', // Add this to match the discriminator
        title,
        pageNumber: parsedPageNumber,
        subtitle,
        imagesData: imagesData.map(img => ({
          imagesDataTitle: img.imagesDataTitle,
          imagesDataSubtitle: img.imagesDataSubtitle,
          imagesDataImage: img.imagesDataImage
        })),
        isCustom: true // Add this to match the schema
      });

      // Refresh the flipbook data
      await getFlipbookById(flipbookId);

      // Reset form
      setTitle('');
      setPageNumber('');
      setSubtitle('');
      setImagesData([{ 
        imagesDataTitle: '', 
        imagesDataSubtitle: '', 
        imagesDataImage: '' 
      }]);

      toast.success('Gallery page added successfully');
    } catch (error) {
      console.error('Error adding gallery page:', error);
      toast.error(error.message || 'Failed to add gallery page');
    }
  };

  return (
    <div className="add-gallery-page">
      <h3>Add Gallery Page</h3>
      <form onSubmit={handleSubmit}>
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
          <label>Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter page subtitle"
            required
          />
        </div>

        <div className="images-section">
          <h4>Images</h4>
          {imagesData.map((image, index) => (
            <div key={index} className="image-entry">
              <div className="image-fields">
                <input
                  type="text"
                  value={image.imagesDataTitle}
                  onChange={(e) => handleUpdateImage(index, 'imagesDataTitle', e.target.value)}
                  placeholder="Image title"
                  required
                />
                <input
                  type="text"
                  value={image.imagesDataSubtitle}
                  onChange={(e) => handleUpdateImage(index, 'imagesDataSubtitle', e.target.value)}
                  placeholder="Image subtitle"
                  required
                />
                <input
                  type="text"
                  value={image.imagesDataImage}
                  onChange={(e) => handleUpdateImage(index, 'imagesDataImage', e.target.value)}
                  placeholder="Image URL"
                  required
                />
              </div>
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveImage(index)}
                disabled={imagesData.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-image-btn"
            onClick={handleAddImage}
          >
            Add Image
          </button>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Gallery Page'}
        </button>
      </form>
    </div>
  );
};

export default AddGalleryPage; 