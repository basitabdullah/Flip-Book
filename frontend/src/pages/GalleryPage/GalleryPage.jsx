import React, { useState, useEffect } from 'react';
import './GalleryPage.scss';

const GalleryPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
      title: 'Luxury Pool',
      description: 'Infinity pool overlooking the ocean'
    },
    {
      url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
      title: 'Presidential Suite',
      description: 'Experience ultimate luxury'
    },
    {
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop',
      title: 'Gourmet Restaurant',
      description: 'Fine dining at its best'
    },
    {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop',
      title: 'Spa Retreat',
      description: 'Relax and rejuvenate'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === images.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="gallery-page">
      <h1>Our Gallery</h1>
      <p className="subtitle">Discover the epitome of luxury</p>

      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image.url} alt={image.title} loading="lazy" />
              <div className="slide-content">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {images.map((_, index) => (
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