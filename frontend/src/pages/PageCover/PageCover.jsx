import React from 'react';
import './PageCover.scss'; // Assuming you have a SCSS file for styling

const PageCover = ({ backgroundImage, title, subtitle }) => {
  return (
    <div 
      className="page-cover" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay"></div> {/* Optional: Adds a dark overlay for better text visibility */}
      <div className="cover-content">
        <h1 className="cover-title">{title}</h1>
        {subtitle && <h2 className="cover-subtitle">{subtitle}</h2>}
      </div>
    </div>
  );
};

export default PageCover;