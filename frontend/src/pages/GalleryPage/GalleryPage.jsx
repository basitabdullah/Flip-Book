import React, { useState, useEffect } from 'react';
import './GalleryPage.scss';

const GalleryPage = ({ pageData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;

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
                src={`${backendUrl}${image.imagesDataImage}`} 
                alt={`${backendUrl}${image.imagesDataImage}`} 
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