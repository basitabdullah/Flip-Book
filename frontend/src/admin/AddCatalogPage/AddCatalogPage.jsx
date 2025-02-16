import React, { useState } from 'react';
import useCatalogPageStore from '../../stores/useCatalogPageStore';
import useFlipbookStore from '../../stores/useFlipbookStore';
import { toast } from 'react-hot-toast';
import './AddCatalogPage.scss';

const AddCatalogPage = ({ flipbookId }) => {
  const { addCatalogPage } = useCatalogPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [catalogItems, setCatalogItems] = useState([{
    name: '',
    price: '',
    image: '',
    amenities: []
  }]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addCatalogPage(flipbookId, {
        title,
        pageNumber: parseInt(pageNumber),
        subtitle,
        catalogItems,
        pageType: 'Catalog',
        isCustom: true
      });

      // Refresh flipbook data
      await getFlipbookById(flipbookId);

      // Reset form
      setTitle('');
      setPageNumber('');
      setSubtitle('');
      setCatalogItems([{
        name: '',
        price: '',
        image: '',
        amenities: []
      }]);

      toast.success('Catalog page added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add catalog page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-catalog-page">
      <h3>Add Catalog Page</h3>
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
            placeholder="Enter subtitle"
            required
          />
        </div>

        <div className="catalog-items-section">
          <div className="section-header">
            <h4>Catalog Items</h4>
            <button type="button" onClick={handleAddItem} className="add-btn">
              + Add Item
            </button>
          </div>

          {catalogItems.map((item, index) => (
            <div key={index} className="catalog-item">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                  placeholder="Item name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                  placeholder="Item price"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => handleUpdateItem(index, 'image', e.target.value)}
                  placeholder="Image URL"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={item.amenities.join(', ')}
                  onChange={(e) => handleUpdateAmenities(index, e.target.value)}
                  placeholder="Amenity 1, Amenity 2, ..."
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="remove-btn"
              >
                Remove Item
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Catalog Page'}
        </button>
      </form>
    </div>
  );
};

export default AddCatalogPage; 