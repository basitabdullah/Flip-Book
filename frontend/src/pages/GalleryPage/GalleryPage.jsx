import React, { useState, useEffect } from 'react';
import './GalleryPage.scss';

const GalleryPage = ({ pageData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;
  
  useEffect(() => {
    if (pageData?.imagesData?.length) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => 
          prevSlide === pageData.imagesData.length - 1 ? 0 : prevSlide + 1
        );
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [pageData?.imagesData?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!pageData) return null;

  const getImageSrc = (imagePath) => {
    // Check if the path starts with /uploads/ to determine if it's an uploaded file
    if (imagePath.startsWith('/uploads/')) {
      return `${backendUrl}/backend${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="gallery-page">
      <h1>{pageData.title}</h1>
      <p className="subtitle">{pageData.subtitle}</p>

      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {pageData.imagesData.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img 
                src={getImageSrc(image.imagesDataImage)}
                alt={image.imagesDataTitle || 'Gallery image'} 
                loading="lazy" 
              />
              <div className="slide-content">
                <h3>{image.imagesDataTitle}</h3>
                <p>{image.imagesDataSubtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {pageData.imagesData.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage; 