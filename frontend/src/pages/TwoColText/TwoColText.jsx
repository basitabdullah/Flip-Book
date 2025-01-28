import React from 'react'
import './TwoColText.scss'

const TwoColText = ({ title, textContent, imageSrc, imageAlt, imageCaption }) => {
  // Split text content into two columns if it's an array
  const midPoint = Array.isArray(textContent) ? Math.ceil(textContent.length / 2) : 0;
  const firstColumnText = Array.isArray(textContent) ? textContent.slice(0, midPoint) : [];
  const secondColumnText = Array.isArray(textContent) ? textContent.slice(midPoint) : [];

  return (
    <div className="two-col-container">
      <div className="image-section">
        <h2>{title}</h2>
        <img 
          src={imageSrc} 
          alt={imageAlt || title} 
          className="feature-image"
        />
        {imageCaption && <p className="image-caption">{imageCaption}</p>}
      </div>
      <div className="text-columns">
        <div className="column">
          {firstColumnText.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="separator"></div>
        <div className="column">
          {secondColumnText.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TwoColText