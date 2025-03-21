import React, { useState } from "react";
import "./CatalogPage.scss";
import { LiaExchangeAltSolid } from "react-icons/lia";
const CatalogPage = ({ pageData }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="catalog-page">
      <h1>{pageData.title}</h1>
      <p className="subtitle">{pageData.subtitle}</p>

      {pageData.position === "vertical" ? (
        <div className="room-grid">
          {pageData.catalogItems.map((room, index) => (
            <div
              key={index}
              className={`room-card ${
                selectedRoom === index ? "selected" : ""
              }`}
              onClick={() => setSelectedRoom(index)}
            >
              <div className="room-image">
                <img src={room.image} alt={room.name} loading="lazy" />
              </div>
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="price">
                  {room.price}
                  {/* <span>/booking</span> */}
                </p>
                <div className="amenities">
                  {room.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
                <button className="book-button">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-horizonatal-wrapper">
          {pageData.catalogItems.map((room, index) => (
            <div key={index} className="catalog-item">
              <img src={room.image} alt={room.name} loading="lazy" />
              <h4>{room.name}</h4>
              <div className="catalog-amenities">
                {room.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
              <p className="catalog-price">
                {room.price}
                {/* <span>/booking</span> */}
              </p>
              <button className="catalog-book-now pulse-animation">
                Book now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
