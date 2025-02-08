import React from "react";
import "./Footer.scss";
import useFlipbookStore from "../../stores/useFlipbookStore";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { loading } = useFlipbookStore();
  return (
    !loading && (
      <footer className="footer">
        <p>&copy; {currentYear} Rose Wood Gulmarg</p>
        <p>
          Designed And Developed{" "}
          <a
            target="_"
            href="https://www.gabfire.in/"
          >
            Gabfire.in
          </a>
        </p>
      </footer>
    )
  );
};

export default Footer;
