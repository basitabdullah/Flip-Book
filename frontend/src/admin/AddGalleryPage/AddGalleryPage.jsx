import React, { useState } from 'react';
import useGalleryPageStore from '../../stores/useGalleryPageStore';
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('url');
  
  const { addGalleryPage, loading } = useGalleryPageStore();

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

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);
    } else {
      const newFiles = [...selectedFiles];
      newFiles[index] = null;
      setSelectedFiles(newFiles);
      handleUpdateImage(index, 'imagesDataImage', '');
    }
  };

  const handleRemoveImage = (index) => {
    if (imagesData.length > 1) {
      setImagesData(imagesData.filter((_, i) => i !== index));
      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
      (img.imagesDataImage || uploadMethod === 'file')
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

      const formData = new FormData();
      formData.append('title', title);
      formData.append('pageNumber', parsedPageNumber);
      formData.append('subtitle', subtitle);

      // Handle image data differently based on upload method
      if (uploadMethod === 'file') {
        // Send image metadata without URLs
        const imageMetadata = imagesData.map(img => ({
          imagesDataTitle: img.imagesDataTitle,
          imagesDataSubtitle: img.imagesDataSubtitle,
          imagesDataImage: '' // Backend will handle file paths
        }));
        formData.append('imagesData', JSON.stringify(imageMetadata));

        // Append actual files
        selectedFiles.forEach((file, index) => {
          if (file) {
            formData.append('images', file);
          }
        });
      } else {
        // For URL method, send the data as is
        formData.append('imagesData', JSON.stringify(imagesData));
      }

      await addGalleryPage(flipbookId, formData);

      // Reset form
      setTitle('');
      setPageNumber('');
      setSubtitle('');
      setImagesData([{ 
        imagesDataTitle: '', 
        imagesDataSubtitle: '', 
        imagesDataImage: '' 
      }]);
      setSelectedFiles([]);
      setUploadMethod('url');

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

        <div className="form-group">
          <label>Upload Method</label>
          <select
            value={uploadMethod}
            onChange={(e) => setUploadMethod(e.target.value)}
          >
            <option value="url">URL</option>
            <option value="file">File Upload</option>
          </select>
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
                {uploadMethod === 'url' ? (
                  <input
                    type="text"
                    value={image.imagesDataImage}
                    onChange={(e) => handleUpdateImage(index, 'imagesDataImage', e.target.value)}
                    placeholder="Image URL"
                    required
                  />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, index)}
                    accept="image/*"
                    key={`file-input-${index}`}
                    required={!image.imagesDataImage}
                  />
                )}
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