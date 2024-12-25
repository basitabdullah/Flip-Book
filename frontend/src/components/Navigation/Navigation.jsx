import React from "react";
import "./Navigation.scss";
import { RxThickArrowRight } from "react-icons/rx";
import { RxThickArrowLeft } from "react-icons/rx";
import { MdBackupTable } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = ({ bookRef }) => { 
  const goForward = () => {
    if (bookRef?.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goBackward = () => {
    if (bookRef?.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const user = {
    role : "admin"
  }

  return (
    <div className="navigation">
      <div className="buttons">
        <div className="button" title="Previous Page">
          <RxThickArrowLeft onClick={goBackward} />
        </div>
        <div className="button" title="Next Page">
          <RxThickArrowRight onClick={goForward} />
        </div>
        <div className="button" title="Table of Contents">
          <MdBackupTable />
        </div>
        <div className="button" title="Share">
          <FaShareAlt />
        </div>
        <div className="button" title="Search">
          <IoSearch />
        </div>
        <div className="button" title="Search">
          <CgProfile />
        </div>
       {
        user.role === "admin" && (
          <Link to="/admin-dashboard" className="button" title="Search">
            <FaLock />
          </Link>
        )
       }
        
      </div>
    </div>
  );
};

export default Navigation;
  