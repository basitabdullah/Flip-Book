import React from 'react';
import './PageCover.scss'; // Assuming you have a SCSS file for styling
import ShinyText from '../../reactBits/ShinyText/ShinyText';
const PageCover = ({ backgroundImage, title, subtitle }) => {

  const currentYear = new Date().getFullYear()
  return (
    <div 
      className="page-cover" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay"></div> {/* Optional: Adds a dark overlay for better text visibility */}
      <div className="cover-content">
        {subtitle && <h2 className="cover-subtitle">{subtitle}</h2>}
        {/* <h1 className="cover-title">{title}</h1> */}
      <ShinyText text={title} disabled={false} speed={3} className='custom-class' />

      </div>
      <div className="cover-content-bottom">
        <p>Copyright {title} | e-catalogue {currentYear}</p>
      </div>
    </div>
  );
};

export default PageCover;