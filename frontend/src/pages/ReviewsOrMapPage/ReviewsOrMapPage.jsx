import React from 'react';
import './ReviewsOrMapPage.scss';

const ReviewsOrMapPage = ({ pageData }) => {
  const { title, content } = pageData;

  const isMapEmbed = content.includes('maps.google.com') || content.includes('google.com/maps');

  return (
    <div className="reviews-or-map-page">
      <h1 className="page-title">{title}</h1>
      
      <div className="content-container">
        <iframe
          src={content}
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={isMapEmbed ? "Google Maps" : "Reviews"}
        />
      </div>
    </div>
  );
};

export default ReviewsOrMapPage; 