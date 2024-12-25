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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d-0.127758!3d51.507351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3f4b5e9b91%3A0x27b21d8a9f48b0d3!2sLondon!5e0!3m2!1sen!2suk!4v1234567890"
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
