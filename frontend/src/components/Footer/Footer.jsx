import React from "react";
import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <p>&copy; {currentYear} Rose Wood Gulmarg</p>
      </div>
      <div className="footer__bottom">
        <p>Designed and Devloped By Gabfire</p>
      </div>
    </footer>
  );
};



export default Footer;
