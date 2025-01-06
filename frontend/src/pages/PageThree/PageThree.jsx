import React from "react";
import "./PageThree.scss";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const PageThree = () => {
  return (
    <div className="page-three">
      <div className="content">
        <h1>Sestieri</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit at
          quasi numquam aliquid impedit delectus, ipsum maiores animi odio
          perspiciatis labore minima deleniti aliquam, mollitia temporibus rerum
          aspernatur commodi nemo.
        </p>
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472.1380231480555!2d74.81923710242764!3d34.07366431486443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18f94929ac17f%3A0x978c2db695a2a159!2sCity%20Mall!5e0!3m2!1sen!2sin!4v1736158100796!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
      </div>
    </div>
  );
};

export default PageThree;
