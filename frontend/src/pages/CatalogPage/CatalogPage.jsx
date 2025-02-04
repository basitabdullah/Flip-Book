import React, { useState } from 'react';
import './CatalogPage.scss';

const CatalogPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const rooms = [
    {
      id: 1,
      name: 'Deluxe Suite',
      price: '₹24,999',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
      amenities: ['King Bed', 'Ocean View', 'Spa Bath', 'Mini Bar']
    },
    {
      id: 2,
      name: 'Executive Room',
      price: '₹16,999',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
      amenities: ['Queen Bed', 'City View', 'Work Desk', 'Coffee Maker']
    }
  ];

  return (
    <div className="catalog-page">
      <h1>Luxury Accommodations</h1>
      <p className="subtitle">Experience unparalleled comfort and elegance</p>
      
      <div className="room-grid">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
            onClick={() => setSelectedRoom(room.id)}
          >
            <div className="room-image">
              <img src={room.image} alt={room.name} loading="lazy" />
            </div>
            <div className="room-info">
              <h3>{room.name}</h3>
              <p className="price">{room.price}<span>/night</span></p>
              <div className="amenities">
                {room.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
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