import React from 'react';
import './ReviewsPage.scss';
import { FaStar } from 'react-icons/fa';

const ReviewsPage = () => {
  const reviews = [
    {
      id: 1,
      name: "Bhat Faisal",
      rating: 5,
      date: "March 2024",
      comment: "Thank you so much @Rosewood team I had the most delightful experience at Hotel Rosewood, which truly exceeded all my expectations. From the moment I arrived, I was greeted with exceptional hospitality and a warm, welcoming atmosphere. The rooms were immaculate and tastefully designed, offering both luxury and comfort. The staff went above and beyond to ensure every detail of my stay was perfect. The location is ideal, making it convenient for both relaxation and exploration. Whether you're visiting for a romantic getaway, Hotel Rosewood offers everything you could possibly need.",
      image: "https://lh3.googleusercontent.com/a/ACg8ocJpJcdLCz2KVp_jyTfAVoeQuSlq3AbKi8X52yiHIhulqaYZIQ=s80-rp-mo-ba2-br100"
    },
    {
      id: 2,
      name: "Poonam Dongre",
      rating: 5,
      date: "February 2025",
      comment: "This was my second time stay at this amazing property, and once again, it exceeded my expectations. The warm and welcoming ambiance, combined with the stunning snow-covered surroundings, made for a truly memorable experience.",
      image: "https://lh3.googleusercontent.com/a-/ALV-UjW7iYBHrMGJ3bPuxRUBpjVZVGeSwT4ZhVgXLtKM2XWonHxoz67Kaw=s80-rp-mo-br100"
    },
    {
      id: 3,
      name: "Fariqa Badri",
      rating: 4,
      date: "January 2025",
      comment: "I had the most delightful experience at Hotel Rosewood, which truly exceeded all my expectations. From the moment I arrived, I was greeted with exceptional hospitality and a warm, welcoming atmosphere. The rooms were immaculate and tastefully designed, offering both luxury and comfort. The staff went above and beyond to ensure every detail of my stay was perfect. The location is ideal, making it convenient for both relaxation and exploration. Whether you're visiting for a romantic getaway, a family vacation, or a business trip, Hotel Rosewood offers everything you could possibly need. Without a doubt, it's the best hotel in Gulmarg, and I am already looking forward to my next visit!",
      image: "https://lh3.googleusercontent.com/a/ACg8ocJhhIbMN7uKhD2Cf18XWhWpRCHIs7pwIMyjQ3fskNRyDfHD5Lk=s80-rp-mo-br100"
    },
    {
      id: 4,
      name: "Muntaha Goroo",
      rating: 5,
      date: "Jan 2025",
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