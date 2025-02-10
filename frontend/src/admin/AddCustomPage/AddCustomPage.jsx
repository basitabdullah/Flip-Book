import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFlipbookStore from "../../stores/useFlipbookStore";
import AddIndexPage from "../AddIndexPage/AddIndexPage";
import { IoListOutline, IoBookOutline, IoGridOutline } from "react-icons/io5";
import "./AddCustomPage.scss";

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
    // More page types can be added here in the future
    // { 
    //   id: "chapter", 
    //   name: "Chapter Page", 
    //   icon: <IoBookOutline className="icon" />,
    //   description: "Add a chapter introduction"
    // },
    // { 
    //   id: "grid", 
    //   name: "Grid Page", 
    //   icon: <IoGridOutline className="icon" />,
    //   description: "Create a grid layout"
    // }
  ];

  const renderPageForm = () => {
    switch (selectedPageType) {
      case "index":
        return <AddIndexPage flipbookId={flipbookId} />;
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
