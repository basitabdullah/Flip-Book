import React, { useState, useEffect } from "react";
import "./IndexPage.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IndexPage = ({ goToPage }) => {
  const { publishedFlipbooks } = useFlipbookStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    "https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829214/Rose%20Wood/deluxebalcony-0236-1_wbd2u2.jpg",
    "https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829205/Rose%20Wood/deluxeroom-3_lccamm.jpg",
    "https://res.cloudinary.com/dfntxbbxh/image/upload/v1738829223/Rose%20Wood/deluxe-0310_vset6l.jpg",
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false
  };

  // Function to handle image change

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);


  const filteredPublishedFlipbooks = Array.isArray(publishedFlipbooks)
    ? publishedFlipbooks.filter((flipbook) => flipbook.isPublished)
    : [];

  const publishedPages =
    filteredPublishedFlipbooks.length > 0
      ? filteredPublishedFlipbooks[0].pages
      : [];

  return (
    <div className="index-page">
      <div className="index-content">
        <div className="index-title">
          <p className="index-text">Index</p>
        </div>

        <div className="slider-container">
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index} className="slide">
                <img src={img} alt={`slide ${index + 1}`} />
              </div>
            ))}
          </Slider>
        </div>

        <div className="other-pages-wrapper">
          <div className="other-pages">
            {[1,2, 3, 4, 5, 6].map((index) => (
              <div
                className="page-entry"
                onClick={() => goToPage(index + 1)}
                key={index}
              >
                <p className="num">{String(index + 1).padStart(2, "0")}</p>
                <p className="page-title">{publishedPages[index]?.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;