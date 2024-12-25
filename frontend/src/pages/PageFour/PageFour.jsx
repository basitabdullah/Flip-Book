import "./PageFour.scss";
import { useState } from "react";

const PageFour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "https://images.unsplash.com/photo-1731340319631-2cc2f07d154a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1730979466254-91ca4a3123d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1695749787631-644ada7d5892?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsOpen(false);
  };
  return (
    <div className="page-four">
      <div className="content">
        <h1>Gallery</h1>

        <div className="image-gallery">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              className="thumbnail"
              onClick={() => openModal(image)}
            />
          ))}
        </div>

        {isOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="enlarged-image"
              />
            </div>
          </div>
        )}
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur ea
          quam reiciendis nulla cupiditate, est doloremque veniam, dicta, non
          vero vitae recusandae quod fuga rerum aliquam illo error quaerat!
          Provident possimus officia iure tempora accusamus m Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Totam necessitatibus qui at? Ad
          qui iure quibusdam, doloribus aut quo maxime sed error, est, alias
          corrupti rerum illo? Itaque, dolorum facere!
        </p>
      </div>
    </div>
  );
};

export default PageFour;
