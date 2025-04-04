import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import HTMLFlipBook from "react-pageflip";
import "./Home.scss";
import IndexPage from "../IndexPage/IndexPage";
import Navigation from "../../components/Navigation/Navigation";
import html2canvas from "html2canvas";
import useFlipbookStore from "../../stores/useFlipbookStore";
import pageFlipSound from "../../assets/page-flip-sound.mp3";
import Loader from "../../components/Loader/Loader";
import CoverPage from "../../pages/PageCover/PageCover";
import CatalogPage from "../../pages/CatalogPage/CatalogPage";
import GalleryPage from "../../pages/GalleryPage/GalleryPage";
import SocialPage from "../../pages/SocialPage/SocialPage";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import ThanksPage from "../ThanksPage/ThanksPage";
import { Link, useNavigate } from "react-router-dom";
import ReviewsOrMapPage from "../ReviewsOrMapPage/ReviewsOrMapPage";
import BlurText from "../../reactBits/BlurText/BlurText";
import SplitText from "../../reactBits/SplitText/SplitText";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import { useUserStore } from "../../stores/useUserStore";

const Home = () => {
  const bookRef = useRef(null);
  const audioRef = useRef(new Audio(pageFlipSound));
  const [isSnipping, setIsSnipping] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const { loading, publishedFlipbooks, getPublishedFlipbooks } =
    useFlipbookStore();
  const { user, checkingAuth, checkAuth } = useUserStore();
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;

  useEffect(() => {
    getPublishedFlipbooks();
    checkAuth().then(() => {
      console.log('Auth check completed');
    }).catch(error => {
      console.error('Auth check failed:', error);
    });
  }, [getPublishedFlipbooks, checkAuth]);

  

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "none";
    }
  }, []);

  const filteredPublishedFlipbooks = Array.isArray(publishedFlipbooks)
    ? publishedFlipbooks.filter((flipbook) => flipbook?.isPublished)
    : [];

  const publishedPages = filteredPublishedFlipbooks[0]?.pages || [];

  const getYouTubeEmbedUrl = useCallback((url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) {
      return `${url}?rel=0&modestbranding=1&host=https://www.youtube-nocookie.com`;
    }
    let videoId = "";
    const watchUrlMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    );
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
      : "";
  }, []);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('backend/uploads/')) {
      return `${backendUrl}/${imagePath}`;
    }
    return imagePath;
  };

  const renderContent = useCallback(
    (page) => {
      switch (page.contentType) {
        case "video":
          const youtubeEmbedUrl = getYouTubeEmbedUrl(page.content);
          return (
            <div className="video-container">
              <iframe
                loading="lazy"
                src={`${youtubeEmbedUrl}&autoplay=1&mute=1`}
                title={`YouTube video for page ${page.pageNumber}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                allowFullScreen
                onLoad={(e) => {
                  e.target.onerror = () => console.log("Failed to load video");
                }}
              />
            </div>
          );
        case "image":
          return (
            <img
              loading="lazy"
              src={getImageSrc(page.content)}
              alt={page.title}
            />
          );
        case "map":
          return (
            <iframe
              loading="lazy"
              src={page.content}
              width="100%"
              height="315"
              style={{ border: 0 }}
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          );
        default:
          return null;
      }
    },
    [getYouTubeEmbedUrl, getImageSrc]
  );

  const handleStartSnipping = () => {
    setIsSnipping(true);
    document.body.style.cursor = "crosshair";
  };

  const handleMouseDown = (e) => {
    if (!isSnipping) return;
    e.preventDefault();
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isSnipping || !startPoint) return;
      e.preventDefault();
      setEndPoint({ x: e.clientX, y: e.clientY });
    },
    [isSnipping, startPoint]
  );

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

  const sortedPages = useMemo(() => {
    return Array.isArray(publishedPages)
      ? publishedPages
          .filter((page) => page !== null)
          .sort((a, b) => a.pageNumber - b.pageNumber)
      : [];
  }, [publishedPages]);

  const goToPage = (pageIndex) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(pageIndex + 1);
    }
  };

  const goToNextPage = () => {
    if (bookRef?.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goToPreviousPage = () => {
    if (bookRef?.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const renderPageContent = useCallback(
    (page) => {
      const pageType = page.pageType || "Page";

      switch (pageType) {
        case "PublishedGalleryPage":
          return (
            <div className="page-content">
              <GalleryPage
                pageData={{
                  title: page.title,
                  pageNumber: page.pageNumber,
                  subtitle: page.subtitle,
                  imagesData: page.imagesData,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
        case "PublishedIndexPage":
          return (
            <div className="page-content">
              <IndexPage
                pageData={{
                  images: page.images,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
        case "PublishedCatalogPage":
          return (
            <div className="page-content">
              <CatalogPage
                pageData={{
                  title: page.title,
                  pageNumber: page.pageNumber,
                  subtitle: page.subtitle,
                  catalogItems: page.catalogItems,
                  position: page.position,
                  booknowLink: page.booknowLink,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
        case "PublishedSocialPage":
          return (
            <div className="page-content">
              <SocialPage
                pageData={{
                  title: page.title,
                  pageNumber: page.pageNumber,
                  subtitle: page.subtitle,
                  street: page.street,
                  city: page.city,
                  postalCode: page.postalCode,
                  phone: page.phone,
                  email: page.email,
                  mapUrl: page.mapUrl,
                  socialLinks: page.socialLinks,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
        case "PublishedReviewsOrMapPage":
          return (
            <div className="page-content">
              <ReviewsOrMapPage
                pageData={{
                  title: page.title,
                  content: page.content,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );

        case "PublishedBackCover":
          return (
            <div className="page-content">
              <ThanksPage
                pageData={{
                  title: page.title,
                  subtitle: page.subtitle,
                  image: page.image,
                }}
              />
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
        case "PublishedPage":
        default:
          return (
            <div className="page-content">
              <div className="content custom-scrollbar">
                <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                  <SplitText
                    text={page.title}
                    className="text-2xl font-semibold text-center"
                    delay={100}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                  />
                </h1>

                {renderContent(page)}

                <p className="page-description">
                  {" "}
                  <BlurText
                    text={page.description}
                    delay={10}
                    animateBy="words"
                    direction="top"
                    className="text-2xl mb-8"
                  />
                </p>
              </div>
              <div className="page-number">{page.pageNumber}</div>
            </div>
          );
      }
    },
    [goToPage, renderContent]
  );

  if (loading) return <Loader />;

  
  const currentFlipbook = filteredPublishedFlipbooks[0];
  const flipbookImage = currentFlipbook?.flipbook?.image;
  const flipbookName = currentFlipbook?.name;

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
        {!checkingAuth && !user && <LoginPopup />}
        <HTMLFlipBook
          width={Math.min(window.innerWidth * 0.8, 450)}
          height={window.innerWidth < 600 ? 500 : 600}
          size="stretch"
          minWidth={320}
          maxWidth={450}
          maxHeight={window.innerWidth < 600 ? 500 : 550}
          ref={bookRef}
          showCover={true}
          useMouseEvents={false}
          drawShadow={true}
          maxShadowOpacity={0.8}
          flippingTime={500}
          onFlip={() => {
            if (!audioRef.current.src) {
              audioRef.current.src = pageFlipSound;
            }
            audioRef.current.play().catch(console.error);
          }}
        >
          <div key="cover" className="page">
            <div className="page-content">
              <CoverPage
                backgroundImage={flipbookImage}
                title={flipbookName}
                subtitle={"Experience the quality of daynamic e-catalogue."}
              />
            </div>
          </div>

          {sortedPages.map((page) => (
            <div key={page._id || `page-${page.pageNumber}`} className="page">
              {renderPageContent(page)}
            </div>
          ))}
        </HTMLFlipBook>

        <div className="navigation-arrow left" onClick={goToPreviousPage}>
          <RiArrowLeftWideFill size={40} color="#fff" />
        </div>
        <div className="navigation-arrow right" onClick={goToNextPage}>
          <RiArrowRightWideFill size={40} color="#fff" />
        </div>
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

export default React.memo(Home);
