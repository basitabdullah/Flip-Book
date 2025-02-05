import React from 'react';
import './ReviewsPage.scss';
import { FaStar } from 'react-icons/fa';

const ReviewsPage = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "March 2024",
      comment: "Absolutely stunning place! The ambiance was perfect and the service was exceptional. Will definitely come back again.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "February 2024",
      comment: "A perfect blend of luxury and comfort. The attention to detail in every aspect made our stay memorable.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 4,
      date: "January 2024",
      comment: "Beautiful property with excellent amenities. The staff went above and beyond to make our stay comfortable.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      date: "December 2023",
      comment: "An oasis of tranquility. The gardens are breathtaking and the rooms are impeccably maintained.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`} 
      />
    ));
  };

  return (
    <div className="reviews-page">
      <h1>Guest Reviews</h1>
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <img 
                src={review.image} 
                alt={review.name} 
                className="reviewer-image"
              />
              <div className="reviewer-info">
                <h3>{review.name}</h3>
                <div className="rating">
                  {renderStars(review.rating)}
                </div>
                <span className="date">{review.date}</span>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage; 