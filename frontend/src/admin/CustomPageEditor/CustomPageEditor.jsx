import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useGalleryPageStore from "../../stores/useGalleryPageStore";
import useCatalogPageStore from "../../stores/useCatalogPageStore";
import useSocialPageStore from "../../stores/useSocialPageStore";
import useIndexPageStore from "../../stores/useIndexPageStore";
import useFlipbookStore from "../../stores/useFlipbookStore";
import useReviewsOrMapStore from "../../stores/useReviewsOrMapStore";
import useBackCoverStore from "../../stores/useBackCoverStore";
import IndexPageCard from "./IndexPageCard";
import GalleryPageCard from "./GalleryPageCard";
import CatalogPageCard from "./CatalogPageCard";
import SocialPageCard from "./SocialPageCard";
import ReviewsOrMapPageCard from "./ReviewsOrMapPageCard";
import BackPageCard from "./BackPageCard";
import "./CustomPageEditor.scss";
import Loader from "../../components/Loader/Loader";

const CustomPageEditor = () => {
  const { id } = useParams();
  const {
    indexPages,
    loading: indexLoading,
    error: indexError,
    fetchIndexPages,
  } = useIndexPageStore();
  const {
    galleryPages,
    loading: galleryLoading,
    error: galleryError,
    fetchGalleryPages,
  } = useGalleryPageStore();
  const {
    catalogPages,
    loading: catalogLoading,
    error: catalogError,
    fetchCatalogPages,
  } = useCatalogPageStore();
  const {
    socialPages,
    loading: socialLoading,
    error: socialError,
    fetchSocialPages,
  } = useSocialPageStore();
  const {
    reviewsOrMapPages,
    loading: reviewsOrMapLoading,
    error: reviewsOrMapError,
    fetchReviewsOrMapPages,
  } = useReviewsOrMapStore();
  const {
    backCovers,
    loading: backLoading,
    error: backError,
    fetchBackCovers,
  } = useBackCoverStore();
  const {
    getFlipbookById,
    loading: flipbookLoading,
    flipbook,
  } = useFlipbookStore();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await getFlipbookById(id);
        await fetchIndexPages(id);
        await fetchGalleryPages(id);
        await fetchCatalogPages(id);
        await fetchSocialPages(id);
        await fetchReviewsOrMapPages(id);
        await fetchBackCovers(id);
      }
    };
    loadData();
  }, [
    id,
    getFlipbookById,
    fetchIndexPages,
    fetchGalleryPages,
    fetchCatalogPages,
    fetchSocialPages,
    fetchReviewsOrMapPages,
    fetchBackCovers,
  ]);

  const renderPageCard = (page) => {
    if (!page) {
      console.warn("Null or undefined page data");
      return null;
    }

    console.log("Rendering page:", page.pageType, page);

    switch (page.pageType) {
      case "IndexPage":
        return (
          <IndexPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={indexLoading}
            flipbookId={id}
          />
        );
      case "Gallery":
        return (
          <GalleryPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={galleryLoading}
            flipbookId={id}
          />
        );
      case "Catalog":
        return (
          <CatalogPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={catalogLoading}
            flipbookId={id}
          />
        );
      case "Social":
        return (
          <SocialPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={socialLoading}
            flipbookId={id}
          />
        );
      case "ReviewsOrMap":
        return (
          <ReviewsOrMapPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={reviewsOrMapLoading}
            flipbookId={id}
          />
        );
      case "BackCover":
        return (
          <BackPageCard
            key={`${page._id}-${page.pageNumber}`}
            pageData={page}
            pageNumber={page.pageNumber}
            loading={backLoading}
            flipbookId={id}
          />
        );

      default:
        console.warn("Unknown page type:", page.pageType);
        return null;
    }
  };

  if (
    indexLoading ||
    galleryLoading ||
    catalogLoading ||
    flipbookLoading ||
    socialLoading ||
    reviewsOrMapLoading ||
    backLoading
  )
    return <Loader />;
  if (
    indexError ||
    galleryError ||
    catalogError ||
    socialError ||
    reviewsOrMapError ||
    backError
  )
    return (
      <div>
        Error:{" "}
        {indexError ||
          galleryError ||
          catalogError ||
          socialError ||
          reviewsOrMapError ||
          backError}
      </div>
    );

  // Make sure backCovers is always an array
  const backPagesArray = Array.isArray(backCovers)
    ? backCovers
    : backCovers
    ? [backCovers]
    : [];

  // Combine all pages and sort by page number
  const allPages = [
    ...indexPages,
    ...galleryPages,
    ...catalogPages,
    ...socialPages,
    ...reviewsOrMapPages,
    ...backPagesArray,
  ].sort((a, b) => a.pageNumber - b.pageNumber);

  // Modify the map function to add logging
  const renderedPages = allPages.map((page) => {
    console.log("Attempting to render page:", page);
    return renderPageCard(page);
  });

  if (!allPages || allPages.length === 0) {
    return (
      <div className="no-pages-message">
        <p>No custom pages available</p>
        <p>
          Add an Index, Gallery, Social, Reviews/Map, Back Page or Catalog page
          to get started
        </p>
      </div>
    );
  }

  return (
    <div className="custom-page-editor">
      <h2>Custom Pages Editor</h2>

      <div className="pages-container">{renderedPages}</div>
    </div>
  );
};

export default CustomPageEditor;
