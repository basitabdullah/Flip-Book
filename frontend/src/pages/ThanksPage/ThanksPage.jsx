import React from "react";
import "./ThanksPage.scss"; // Assuming you have a SCSS file for styling

const ThanksPage = ({ pageData }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;
  console.log(pageData?.image);
  console.log("url", backendUrl);
  
  // Use the image from pageData if available, otherwise use a fallback
  const imageUrl = pageData?.image 
    ? `${backendUrl}/${pageData.image}` 
    : "https://images.unsplash.com/photo-1735615479436-6a697c3e0d48?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="thanks-page">
      <img 
        src={imageUrl} 
        alt="Thank you background" 
        className="thanks-background-image" 
      />
      <div className="overlay"></div>
      <div className="thanks-content">
        <h1 className="thanks-title">{pageData?.title}</h1>
        <h2 className="thanks-subtitle">{pageData?.subtitle}</h2>
      </div>
    </div>
  );
};

export default ThanksPage;

