import React, { useState } from "react";
import "./ThanksPage.scss";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import CircularText from "../../reactBits/CircularText/CircularText";
import SplitText from "../../reactBits/SplitText/SplitText";
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
      <div
        className="overlay"
        style={visible ? { backgroundColor: "rgba(0, 0, 0, 0.5)" } : {}}
      />
      <div className="thanks-content">
        <h1
          className="thanks-title"
          style={{
            display: !visible ? "none" : "",
          }}
        >
          <SplitText
            text={pageData?.title}
            className="text-2xl font-semibold text-center"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
          />
        </h1>

        <h2
          style={{
            display: !visible ? "none" : "",
          }}
          className="thanks-subtitle"
        >
          <SplitText
            text={pageData?.subtitle}
            className="text-2xl font-semibold text-center"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
          />
        </h2>
      </div>
    </div>
  );
};

export default ThanksPage;
