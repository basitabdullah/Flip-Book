import React from "react";
import "./IndexPage.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
import indexImg from "../../assets/indexImg.jpg";

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
            <p className="index-text">Index</p>
          </div>
        </div>

          <img className="indexImg" src={indexImg} alt="index" />
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
