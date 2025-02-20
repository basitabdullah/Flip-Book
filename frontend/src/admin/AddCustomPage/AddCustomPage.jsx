import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddIndexPage from "../AddIndexPage/AddIndexPage";
import AddGalleryPage from "../AddGalleryPage/AddGalleryPage";
import { 
  IoListOutline, 
  IoImagesOutline, 
  IoGridOutline, 
  IoPeopleOutline,
  IoMapOutline 
} from "react-icons/io5";
import "./AddCustomPage.scss";
import AddCatalogPage from "../AddCatalogPage/AddCatalogPage";
import AddSocialPage from "../AddSocialPage/AddSocialPage";
import AddReviewsOrMapPage from "../AddReviewsOrMapPage/AddReviewsOrMapPage";

const AddCustomPage = () => {
  const { flipbookId } = useParams();
  const [selectedPageType, setSelectedPageType] = useState("");

  const pageTypes = [
    { 
      id: "index", 
      name: "Index Page", 
      icon: <IoListOutline className="icon" />,
      description: "Create a table of contents"
    },
    { 
      id: "gallery", 
      name: "Gallery Page", 
      icon: <IoImagesOutline className="icon" />,
      description: "Create an image gallery"
    },
    { 
      id: "catalog", 
      name: "Catalog Page", 
      icon: <IoGridOutline className="icon" />,
      description: "Create a product catalog"
    },
    { 
      id: "social", 
      name: "Social Page", 
      icon: <IoPeopleOutline className="icon" />,
      description: "Create a contact & social media page"
    },
    { 
      id: "reviews-map", 
      name: "Reviews/Map Page", 
      icon: <IoMapOutline className="icon" />,
      description: "Add embedded reviews or map"
    }
  ];

  const renderPageForm = () => {
    switch (selectedPageType) {
      case "index":
        return <AddIndexPage flipbookId={flipbookId} />;
      case "gallery":
        return <AddGalleryPage flipbookId={flipbookId} />;
      case "catalog":
        return <AddCatalogPage flipbookId={flipbookId} />;
      case "social":
        return <AddSocialPage flipbookId={flipbookId} />;
      case "reviews-map":
        return <AddReviewsOrMapPage flipbookId={flipbookId} />;
      default:
        return null;
    }
  };

  return (
    <div className="add-custom-page">
      <h2>Add Custom Page</h2>

      {!selectedPageType ? (
        <div className="page-type-grid">
          {pageTypes.map((type) => (
            <button
              key={type.id}
              className="page-type-card"
              onClick={() => setSelectedPageType(type.id)}
            >
              {type.icon}
              <div className="content">
                <span className="name">{type.name}</span>
                <span className="description">{type.description}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="page-form-container">
          {renderPageForm()}
        </div>
      )}
    </div>
  );
};

export default AddCustomPage;
