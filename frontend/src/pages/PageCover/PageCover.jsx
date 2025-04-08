import React from "react";
import "./PageCover.scss"; // Assuming you have a SCSS file for styling
const PageCover = ({ backgroundImage, title, subtitle }) => {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className="page-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay"></div>{" "}
      <div className="cover-content">
        {/* title for later : new feature */}
        {/* <h1>
         {title}
        </h1> */}
      </div>
      <div className="cover-content-bottom">
        <p>
          Copyright {title} | e-catalogue {currentYear}
        </p>
      </div>
    </div>
  );
};

export default PageCover;
