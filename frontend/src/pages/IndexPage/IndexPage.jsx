import React from "react";
import "./IndexPage.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";

const IndexPage = ({ goToPage }) => {
  const { publishedFlipbooks } = useFlipbookStore();

  // Safely filter published flipbooks with null check
  const filteredPublishedFlipbooks = Array.isArray(publishedFlipbooks)
    ? publishedFlipbooks.filter((flipbook) => flipbook.isPublished)
    : [];

  // Get the pages from the first published flipbook (if any exist)
  const publishedPages = filteredPublishedFlipbooks.length > 0 
    ? filteredPublishedFlipbooks[0].pages 
    : [];

  return (
    <div className="index-page">
      <div className="content">
        <img
          src="https://images.unsplash.com/photo-1731076274484-e3882b02d523?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="err"
        />
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
            <p onClick={() => goToPage(4)}>{">"}{publishedPages[3]?.title}</p>
            <p onClick={() => goToPage(5)}>{">"}{publishedPages[4]?.title}</p>
            <p onClick={() => goToPage(6)}>{">"}{publishedPages[5]?.title}</p>
            <p onClick={() => goToPage(7)}>{">"}{publishedPages[6]?.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
