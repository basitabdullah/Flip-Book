import React from "react";
import "./PageOne.scss";

const Pageone = ({ goToPage }) => {
  return (
    <div className="page-one">
      <div className="content">
        <img
          src="https://images.unsplash.com/photo-1731076274484-e3882b02d523?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="err"
        />
        <div className="featured-pages">
          <div className="index-title">
            <p className="index-number">01</p>
            <p className="index-text">Index</p>
          </div>
          <div className="page-numbers">
            <div className="number">
              <p className="num">02</p>
              <p onClick={() => goToPage(1)}>Introduction</p>
            </div>
            <div className="number">
              <p className="num">03</p>
              <p onClick={() => goToPage(2)}>Siestieri</p>
            </div>
            <div className="number">
              <p className="num">04</p>
              <p onClick={() => goToPage(3)}>What to see</p>
            </div>
          </div>
        </div>

        <div className="other-pages-wrapper">
          <div className="other-pages">
            <p onClick={() => goToPage(4)}>{">"}Bridge of sights</p>
            <p onClick={() => goToPage(5)}>{">"}Canals</p>
            <p onClick={() => goToPage(6)}>{">"}Risalto bridge</p>
            <p onClick={() => goToPage(7)}>{">"}St. Marks Basilica</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pageone;
