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

  const handleAddItem = () => {
    setCatalogItems([...catalogItems, {
      name: '',
      price: '',
      image: '',
      amenities: []
    }]);
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
  };

  const handleUpdate = async () => {
    try {
      await updateCatalogPage(flipbookId, pageData._id, {
        title,
        pageNumber,
        subtitle,
        catalogItems,
        position,
        pageType: 'Catalog',
        isCustom: true
      });
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
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page Title"
            className="title-input"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle"
            className="subtitle-input"
          />
          
          <div className="form-group">
            <label>Position</label>
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
              Add Item
            </button>
            {catalogItems.map((item, index) => (
              <div key={index} className="catalog-item-edit">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                  placeholder="Item Name"
                />
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                  placeholder="Price"
                />
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => handleUpdateItem(index, 'image', e.target.value)}
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={item.amenities.join(', ')}
                  onChange={(e) => handleUpdateAmenities(index, e.target.value)}
                  placeholder="Amenities (comma-separated)"
                />
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
          <div className="catalog-section">
            <div className="catalog-grid">
              {catalogItems.map((item, index) => (
                <div key={index} className="catalog-item">
                  <img src={item.image} alt={item.name} />
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