import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./Home.scss";
import IndexPage from "../IndexPage/IndexPage";
import Navigation from "../../components/Navigation/Navigation";
import html2canvas from "html2canvas";
import useFlipbookStore from "../../stores/useFlipbookStore";
import TwoColText from "../TwoColText/TwoColText";

const Home = () => {
  const bookRef = useRef(null);
  const [isSnipping, setIsSnipping] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // Destructure the necessary state and actions from the store
  const {
    pages,
    loading,
    error,
    getPages,
    publishedFlipbooks,
    getPublishedFlipbooks,
  } = useFlipbookStore();

  // Fetch pages and published flipbooks when the component mounts
  useEffect(() => {
    getPages();
    getPublishedFlipbooks();
  }, [getPages, getPublishedFlipbooks]);



  // Log published flipbooks to the console (for debugging)
  useEffect(() => {
    if (publishedFlipbooks) {
      console.log("Published Flipbooks:", publishedFlipbooks);
    }
  }, [publishedFlipbooks]);


  const filteredPublishedFlipbooks = publishedFlipbooks
  ? publishedFlipbooks.filter((flipbook) => flipbook.isPublished)
  : [];

  console.log("Filtered Published Flipbooks:", filteredPublishedFlipbooks);


  // console.log("Filtered Published Pages:", filteredPublishedFlipbooks[0].pages);


  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    let videoId = "";
    const watchUrlMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    );
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const renderContent = (page) => {
    switch (page.contentType) {
      case "video":
        const youtubeEmbedUrl = getYouTubeEmbedUrl(page.content);
        return (
          <iframe
            src={youtubeEmbedUrl}
            title={`YouTube video for page ${page.pageNumber}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      case "image":
        return <img src={page.content} alt={page.title} />;
      case "map":
        return (
          <iframe
            src={page.content}
            width="100%"
            height="315"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        );
      default:
        return null;
    }
  };

  const handleStartSnipping = () => {
    setIsSnipping(true);
    document.body.style.cursor = "crosshair";
  };

  const handleMouseDown = (e) => {
    if (!isSnipping) return;
    e.preventDefault();
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isSnipping || !startPoint) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      setEndPoint({ x: e.clientX, y: e.clientY });
    });
  };

  const handleMouseUp = async () => {
    if (!isSnipping || !startPoint || !endPoint) return;

    setIsSnipping(false);
    document.body.style.cursor = "default";

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const rect = {
      left: Math.min(startPoint.x, endPoint.x),
      top: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(endPoint.x - startPoint.x),
      height: Math.abs(endPoint.y - startPoint.y),
    };

    try {
      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        scale: window.devicePixelRatio,
        allowTaint: true,
        backgroundColor: null,
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1.0)
      );
      const file = new File([blob], "screenshot.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "Screenshot",
          text: "Check out this screenshot!",
        });
      } else {
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error("Error sharing screenshot:", error);
    }

    setStartPoint(null);
    setEndPoint(null);
  };

  const goToPage = (pageIndex) => {
    if (bookRef.current) {
      console.log("Navigating to page:", pageIndex);
      bookRef.current.pageFlip().flip(pageIndex);
    } else {
      console.error("bookRef is not initialized");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <Navigation bookRef={bookRef} onStartSnipping={handleStartSnipping} />
      <div className="home">
        <HTMLFlipBook
          width={450}
          height={620}
          ref={bookRef}
          showCover={true}
          useMouseEvents={false}
        >
          <div key="index" className="page">
            <IndexPage goToPage={goToPage} />
          </div>

          {Array.isArray(pages) &&
           pages
              .sort((a, b) => a.pageNumber - b.pageNumber)
              .map((page) => (
                <div
                  key={page._id || `page-${page.pageNumber}`}
                  className="page"
                >
                  <div className="page-content">
                    <div className="content">
                      <h1>{page.title}</h1>
                      {renderContent(page)}
                      <p>{page.description}</p>
                    </div>
                  </div>
                </div>
              ))}

          <div key="twocol" className="page page-content">
            <div className="content">
              <TwoColText
                title="About Our Journey"
                textContent={[
                  "Welcome to our digital flipbook! This journey began with a simple idea: to create something meaningful and engaging for our readers.",
                  "Through careful design and thoughtful content curation, we've crafted an experience that combines the charm of traditional books with modern digital innovation.",
                  "As you flip through these pages, you'll discover stories",
                  "Through careful design and thoughtful content curation, we've crafted an experience that combines the charm of traditional books with modern digital innovation.",
                  "As you flip through these pages, you'll discover stories",
                ]}
                imageSrc="https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0"
                imageAlt="Journey illustration showing a path through mountains"
                imageCaption="A journey of a thousand miles begins with a single step"
              />
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      {isSnipping && startPoint && endPoint && (
        <div
          style={{
            position: "fixed",
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
            border: "2px dashed #000",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
};

export default Home;