import React, { useState } from 'react';
import useCatalogPageStore from '../../stores/useCatalogPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import "./CatalogPageCard.scss"

const CatalogPageCard = ({ pageData, pageNumber, loading, flipbookId }) => {
  const { updateCatalogPage, deleteCatalogPage } = useCatalogPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pageData?.title || '');
  const [subtitle, setSubtitle] = useState(pageData?.subtitle || '');
  const [position, setPosition] = useState(pageData?.position || 'vertical');
  const [catalogItems, setCatalogItems] = useState(pageData?.catalogItems || []);
  const [booknowLink, setBooknowLink] = useState(pageData?.booknowLink || '');
  const [selectedFiles, setSelectedFiles] = useState(Array(pageData?.catalogItems?.length || 0).fill(null));
  const [uploadMethods, setUploadMethods] = useState(Array(pageData?.catalogItems?.length || 0).fill('url'));

  const handleAddItem = () => {
    setCatalogItems([...catalogItems, {
      name: '',
      price: '',
      image: '',
      amenities: []
    }]);
    setSelectedFiles([...selectedFiles, null]);
    setUploadMethods([...uploadMethods, 'url']);
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setCatalogItems(updatedItems);
  };

  const handleUpdateAmenities = (index, value) => {
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      amenities: value.split(',').map(item => item.trim())
    };
    setCatalogItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setCatalogItems(catalogItems.filter((_, i) => i !== index));
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setUploadMethods(uploadMethods.filter((_, i) => i !== index));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateItem(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMethodChange = (index, method) => {
    const newMethods = [...uploadMethods];
    newMethods[index] = method;
    setUploadMethods(newMethods);

    // Reset the image and file when changing methods
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      image: '',
    };
    setCatalogItems(updatedItems);

    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
  };

  const handleUpdate = async () => {
    try {
      // Validate catalog items
      const validationErrors = catalogItems.some((item, index) => {
        if (!item.name || !item.price || !item.amenities.length) {
          toast.error(`Item ${index + 1}: Name, price and at least one amenity are required`);
          return true;
        }
        if (uploadMethods[index] === 'url' && !item.image) {
          toast.error(`Item ${index + 1}: Image URL is required`);
          return true;
        }
        if (uploadMethods[index] === 'file' && !selectedFiles[index] && !item.image) {
          toast.error(`Item ${index + 1}: Image file is required`);
          return true;
        }
        return false;
      });

      if (validationErrors) return;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('pageNumber', pageNumber);
      formData.append('subtitle', subtitle);
      formData.append('position', position);
      formData.append('booknowLink', booknowLink);

      // Prepare catalog items data
      const itemsForSubmission = catalogItems.map((item, index) => ({
        ...item,
        image: uploadMethods[index] === 'url' ? item.image : item.image, // Preserve existing image for file upload
      }));
      formData.append('catalogItems', JSON.stringify(itemsForSubmission));

      // Append files for items using file upload
      selectedFiles.forEach((file, index) => {
        if (uploadMethods[index] === 'file' && file) {
          formData.append('images', file);
        }
      });

      await updateCatalogPage(flipbookId, pageData._id, formData);
      await getFlipbookById(flipbookId);
      setIsEditing(false);
      toast.success('Catalog page updated successfully');
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete page ${pageNumber}?`)) {
      try {
        await deleteCatalogPage(flipbookId, pageData._id);
        await getFlipbookById(flipbookId);
        toast.success('Page deleted successfully');
      } catch (error) {
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <div className="catalog-card">
      <div className="editor-header">
        <span className="page-number">Page {pageNumber}</span>
        <div className="action-buttons">
          <button onClick={() => setIsEditing(!isEditing)} className={`edit-btn ${isEditing ? 'active' : ''}`}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-mode">
          <div className="input-group">
            <label>Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              className="title-input"
            />
          </div>
          <div className="input-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle"
              className="subtitle-input"
            />
          </div>
          <div className="input-group">
            <label>Booking Link</label>
            <input
              type="text"
              value={booknowLink}
              onChange={(e) => setBooknowLink(e.target.value)}
              placeholder="Enter booking link (optional)"
              className="booknow-link-input"
            />
          </div>
          
          <div className="form-group">
            <label>Layout Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="position-select"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>

          <div className="catalog-items">
            <button onClick={handleAddItem} className="add-item-btn">
              Add Catalog Item
            </button>
            {catalogItems.map((item, index) => (
              <div key={index} className="catalog-item-edit">
                <div className="input-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="input-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                <div className="image-input-group">
                  <div className="input-group">
                    <label>Image Upload Method</label>
                    <select
                      value={uploadMethods[index]}
                      onChange={(e) => handleUploadMethodChange(index, e.target.value)}
                      className="upload-method-select"
                    >
                      <option value="url">URL</option>
                      <option value="file">File Upload</option>
                    </select>
                  </div>

                  {uploadMethods[index] === 'url' ? (
                    <div className="input-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => handleUpdateItem(index, 'image', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                  ) : (
                    <div className="file-upload-container">
                      <div className="input-group">
                        <label>Upload Image</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          accept="image/*"
                          required={!item.image}
                        />
                      </div>
                      {item.image && (
                        <div className="image-preview">
                          <img 
                            src={item.image.startsWith('data:') || item.image.startsWith('http') 
                              ? item.image 
                              : `${import.meta.env.VITE_BACKEND_URL_UPLOADS}/${item.image}`} 
                            alt="Preview" 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <label>Amenities</label>
                  <input
                    type="text"
                    value={item.amenities.join(', ')}
                    onChange={(e) => handleUpdateAmenities(index, e.target.value)}
                    placeholder="Enter amenities (comma-separated)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleUpdate} className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{title}</h3>
          <h4>{subtitle}</h4>
          <p className="position-info">Layout: {position}</p>
          {booknowLink && (
            <p className="booknow-link-info">
              Booking Link: <a href={booknowLink} target="_blank" rel="noopener noreferrer">{booknowLink}</a>
            </p>
          )}
          <div className="catalog-section">
            <div className="catalog-grid">
              {catalogItems.map((item, index) => (
                <div key={index} className="catalog-item">
                  <img 
                    src={item.image.startsWith('data:') || item.image.startsWith('http') 
                      ? item.image 
                      : `${import.meta.env.VITE_BACKEND_URL_UPLOADS}/${item.image}`} 
                    alt={item.name} 
                  />
                  <h5 className="item-name">{item.name}</h5>
                  <p className="item-price">{item.price}</p>
                  <ul className="amenities-list">
                    {item.amenities.map((amenity, i) => (
                      <li key={i}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPageCard;