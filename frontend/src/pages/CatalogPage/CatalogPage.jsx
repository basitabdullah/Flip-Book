import React, { useState } from "react";
import "./CatalogPage.scss";

const CatalogPage = ({ pageData }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;

  const getImageSrc = (imagePath) => {
    // Check if the path starts with /backend/ to determine if it's an uploaded file
    if (imagePath.startsWith('/backend/')) {
      return `${backendUrl}/${imagePath}`;
    }
    return imagePath;
  };

  if (!pageData) return null;

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
                <img
                  src={getImageSrc(room.image)}
                  alt={room.name}
                  loading="lazy"
                />
              </div>
              <div className="room-info">
                <h5>{room.name}</h5>
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
                <a
                  href={pageData.booknowLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-button"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-horizonatal-wrapper">
          {pageData.catalogItems.map((room, index) => (
            <div key={index} className="catalog-item">
              <img src={getImageSrc(room.image)} alt={room.name} loading="lazy" />
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
              <a
                href={pageData.booknowLink}
                target="_blank"
                rel="noopener noreferrer"
                className="catalog-book-now pulse-animation"
              >
                Book now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
