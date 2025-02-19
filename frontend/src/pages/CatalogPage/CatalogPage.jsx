import React, { useState } from 'react';
import './CatalogPage.scss';

const CatalogPage = ({ pageData }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!pageData || !pageData.catalogItems || pageData.catalogItems.length === 0) {
    return (
      <div className="catalog-page">
        <div className="no-content-message">
          <h2>Catalog Coming Soon</h2>
          <p>Our catalog is currently being updated. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <h1>{pageData.title}</h1>
      <p className="subtitle">{pageData.subtitle}</p>
      
      <div className="room-grid">
        {pageData.catalogItems.map((room, index) => (
          <div 
            key={index} 
            className={`room-card ${selectedRoom === index ? 'selected' : ''}`}
            onClick={() => setSelectedRoom(index)}
          >
            <div className="room-image">
              <img src={room.image} alt={room.name} loading="lazy" />
            </div>
            <div className="room-info">
              <h3>{room.name}</h3>
              <p className="price">{room.price}<span>/booking</span></p>
              <div className="amenities">
                {room.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">{amenity}</span>
                ))}
              </div>
              <button className="book-button">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage; 