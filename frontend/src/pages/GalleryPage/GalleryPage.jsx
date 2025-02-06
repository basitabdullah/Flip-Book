import React, { useState, useEffect } from 'react';
import './GalleryPage.scss';

const GalleryPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      url: 'https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829205/Rose%20Wood/deluxeroom-3_lccamm.jpg',
      title: 'Luxury rooms',
      description: 'Experience the best rooms.'
    },
    {
      url: 'https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829223/Rose%20Wood/deluxe-0310_vset6l.jpg',
      title: 'Presidential Suite',
      description: 'Experience ultimate luxury'
    },
    {
      url: 'https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829232/Rose%20Wood/deluxebalcony_sizgbj.jpg',
      title: 'Best Balcony View',
      description: 'Fine dining at its best'
    },
    {
      url: 'https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829248/Rose%20Wood/suitebathroom-2_qtvdoq.jpg',
      title: 'Best Bathrooms',
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