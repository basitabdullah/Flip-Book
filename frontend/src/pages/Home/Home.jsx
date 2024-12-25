import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./Home.scss";
import Pageone from "../PageOne/Pageone";
import PageTwo from "../PageTwo/PageTwo";
import PageThree from "../PageThree/PageThree";
import PageFour from "../PageFour/PageFour";
import PageFive from "../PageFive/PageFive";
import Navigation from "../../components/Navigation/Navigation";

const Home = () => {
  const bookRef = useRef(null);

  const goToPage = (pageIndex) => {
    if (bookRef.current) {
      console.log("Navigating to page:", pageIndex);
      bookRef.current.pageFlip().flip(pageIndex);
      console.log("Navigating to page:", pageIndex);
    } else {
      console.error("bookRef is not initialized");
    }
  };

  return (
    <>
      <Navigation bookRef={bookRef} />
      <div className="home">
        <HTMLFlipBook
          width={450}
          height={620}
          ref={bookRef}
          showCover={true}
          useMouseEvents={false}
        >
          <div className="page">
            <Pageone goToPage={goToPage} />
          </div>
          <div className="page">
            <PageTwo />
          </div>
          <div className="page">
            <PageThree />
          </div>
          <div className="page">
            <PageFour />
          </div>
          <div className="page">
            <PageFive name={"Page 5"} />
          </div>
          <div className="page">
            <PageFive name={"Page 6"} />
          </div>
          <div className="page">
            <PageFive name={"Page 7"} />
          </div>
          <div className="page">
            <PageFive name={"Page 8"} />
          </div>
        </HTMLFlipBook>
      </div>
    </>
  );
};

export default Home;
