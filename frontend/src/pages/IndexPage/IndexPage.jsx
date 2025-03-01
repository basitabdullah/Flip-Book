import React, { useState, useEffect } from "react";
import "./IndexPage.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IndexPage = ({ pageData }) => {
  const { publishedFlipbooks } = useFlipbookStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredPublishedFlipbooks = Array.isArray(publishedFlipbooks)
    ? publishedFlipbooks.filter((flipbook) => flipbook.isPublished)
    : [];

  const publishedPages =
    filteredPublishedFlipbooks.length > 0
      ? filteredPublishedFlipbooks[0].pages
      : [];

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
    arrows: false,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % publishedPages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [publishedPages.length]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;

  const formatImagePath = (path) => {
    return path.replace(/\\/g, '/');
  };

  return (
    <div className="index-page">
      <div className="index-content">
        <div className="index-title">
          <p className="index-text">Index</p>
        </div>

        <div className="slider-container">
          <Slider {...settings}>
            {pageData.images.map((img) => (
              <div key={img} className="slide">
                <img 
                  src={`${backendUrl}${formatImagePath(img)}`} 
                  alt={`slide ${img}`} 
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="other-pages-wrapper">
          <div className="other-pages">
            {publishedPages
              .filter((page) => page.pageNumber % 2 === 0)
              .sort((a, b) => a.pageNumber - b.pageNumber)
              .map((page) => (
                <div className="page-entry" key={page.pageNumber}>
                  <p className="num">
                    {String(page.pageNumber).padStart(2, "0")}
                  </p>
                  <p className="page-title">{page.title}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
