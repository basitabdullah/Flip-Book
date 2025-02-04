import React, { useState, useEffect } from 'react';
import './SocialPage.scss';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const SocialPage = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely stunning hotel with impeccable service. The views are breathtaking!",
      date: "March 2024"
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "A perfect blend of luxury and comfort. Will definitely return!",
      date: "February 2024"
    },
    {
      name: "Emma Williams",
      rating: 5,
      text: "The spa services were outstanding. Best weekend getaway ever!",
      date: "January 2024"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="social-page">
      <h1>Find Us</h1>
      
      {/* Map Section */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965966464116!2d77.59120147473573!3d12.93904901622411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15986765d7d9%3A0xbba2fea7014e5087!2sLalbagh%20Botanical%20Garden!5e0!3m2!1sen!2sin!4v1709755547495!5m2!1sen!2sin"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Social Links */}
      <div className="social-links">
        <a href="#" className="social-icon facebook">
          <FaFacebook /> <span>Follow us</span>
        </a>
        <a href="#" className="social-icon instagram">
          <FaInstagram /> <span>Follow us</span>
        </a>
        <a href="#" className="social-icon twitter">
          <FaTwitter /> <span>Follow us</span>
        </a>
        <a href="#" className="social-icon tripadvisor">
          <FaYoutube /> <span>Subscribe</span>
        </a>
      </div>



      {/* Reviews Carousel */}
      <div className="reviews-section">
        <h2>Guest Reviews</h2>
        <div className="reviews-carousel">
          <div 
            className="reviews-track"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="review-name">{review.name}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
        <div className="review-indicators">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentReview === index ? 'active' : ''}`}
              onClick={() => setCurrentReview(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage; 