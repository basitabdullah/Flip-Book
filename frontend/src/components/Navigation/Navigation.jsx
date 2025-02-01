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
import { BiScreenshot } from "react-icons/bi";

const Navigation = ({ bookRef, onStartSnipping }) => {
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
    role: "admin",
  };

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
       
        <Link to="/login" className="button" title="login">
          <CgProfile />
        </Link>
        {user.role === "admin" && (
          <Link to="/admin/admin-dashboard/flipbooks" className="button" title="Search">
            <FaLock />
          </Link>
        )}

        <div className="button" title="Take Screenshot">
          <BiScreenshot onClick={onStartSnipping} />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
