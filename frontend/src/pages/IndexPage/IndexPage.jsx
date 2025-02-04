import React from "react";
import "./IndexPage.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { BsChevronDoubleDown } from "react-icons/bs";

const IndexPage = ({ goToPage }) => {
  const { publishedFlipbooks } = useFlipbookStore();

  // Safely filter published flipbooks with null check
  const filteredPublishedFlipbooks = Array.isArray(publishedFlipbooks)
    ? publishedFlipbooks.filter((flipbook) => flipbook.isPublished)
    : [];

  // Get the pages from the first published flipbook (if any exist)
  const publishedPages =
    filteredPublishedFlipbooks.length > 0
      ? filteredPublishedFlipbooks[0].pages
      : [];

  return (
    <div className="index-page">
      <div className="content">
        
        <div className="featured-pages">
          <div className="index-title">
            <p className="index-number">00</p>
            <p className="index-text">Index</p>
          </div>
          <div className="page-numbers">
            <div className="number">
              <p className="num">0{publishedPages[0]?.pageNumber}</p>
              <p onClick={() => goToPage(1)}>{publishedPages[0]?.title}</p>
            </div>
            <div className="number">
              <p className="num">0{publishedPages[1]?.pageNumber}</p>
              <p onClick={() => goToPage(2)}>{publishedPages[1]?.title}</p>
            </div>
            <div className="number">
              <p className="num">0{publishedPages[2]?.pageNumber}</p>
              <p onClick={() => goToPage(3)}>{publishedPages[2]?.title}</p>
            </div>
          </div>
        </div>

        <div className="other-pages-wrapper">
          <div className="other-pages">
            <p onClick={() => goToPage(4)}>
              {">"}
              {publishedPages[3]?.title}
            </p>
            <p onClick={() => goToPage(5)}>
              {">"}
              {publishedPages[4]?.title}
            </p>
            <p onClick={() => goToPage(6)}>
              {">"}
              {publishedPages[5]?.title}
            </p>
            <p onClick={() => goToPage(7)}>
              {">"}
              {publishedPages[6]?.title}
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default IndexPage;
