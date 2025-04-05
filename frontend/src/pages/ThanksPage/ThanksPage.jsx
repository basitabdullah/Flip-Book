import React, { useState } from "react";
import "./ThanksPage.scss";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import CircularText from "../../reactBits/CircularText/CircularText";
const ThanksPage = ({ pageData }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL_UPLOADS;
  const [visible, setVisible] = useState(false);

  const imageUrl = pageData?.image
    ? `${backendUrl}/${pageData.image}`
    : "https://images.unsplash.com/photo-1735615479436-6a697c3e0d48?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="thanks-page">
    
      <button
        className="toggle-title"
        onClick={() => {
          setVisible((prev) => !prev);
        }}
      >
        <CircularText
        text=" Click To View Text"
        onHover="speedUp"
        spinDuration={20}
        className="custom-class"
        />
        {visible ? <BsToggleOn /> : <BsToggleOff />}
      </button>
      <img
        src={imageUrl}
        alt="Thank you background"
        className="thanks-background-image"
      />
      <div className="overlay"></div>
      <div className="thanks-content">
        <h1
          className="thanks-title"
          style={{
            display: !visible ? "none" : "",
          }}
        >
          {pageData?.title}
        </h1>
        <h2
          style={{
            display: !visible ? "none" : "",
          }}
          className="thanks-subtitle"
        >
          {pageData?.subtitle}
        </h2>
      </div>
    </div>
  );
};

export default ThanksPage;
