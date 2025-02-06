import React from 'react';
import './ThanksPage.scss'; // Assuming you have a SCSS file for styling

const ThanksPage = () => {
  return (
    <div 
      className="thanks-page" 
      style={{ backgroundImage: `url(https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829232/Rose%20Wood/deluxebalcony_sizgbj.jpg)` }}
    >
      <div className="overlay"></div> {/* Optional: Adds a dark overlay for better text visibility */}
      <div className="thanks-content">
        <h1 className="thanks-title">Thank You for Visiting!</h1>
        <h2 className="thanks-subtitle">We hope to see you again soon.</h2>
      </div>
    </div>
  );
};

export default ThanksPage;