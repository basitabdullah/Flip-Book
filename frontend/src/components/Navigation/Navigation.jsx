import React, { useState } from "react";
import "./Navigation.scss";
import { RxThickArrowRight } from "react-icons/rx";
import { RxThickArrowLeft } from "react-icons/rx";
import { MdBackupTable } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiScreenshot } from "react-icons/bi";
import { useUserStore } from "../../stores/useUserStore";
import { IoLogOutOutline } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
const Navigation = ({ bookRef, onStartSnipping }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTocModal, setShowTocModal] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
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

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const toast = document.createElement("div");
      toast.className = "share-toast";
      toast.textContent = "🔗 Link copied to clipboard!";
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTocClick = () => {
    setShowTocModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="navigation">
        <div className="buttons">
          <div className="button" title="Previous Page">
            <RxThickArrowLeft onClick={goBackward} />
          </div>
          <div className="button" title="Next Page">
            <RxThickArrowRight onClick={goForward} />
          </div>
          <div
            className="button"
            title="Table of Contents"
            onClick={handleTocClick}
          >
            <MdBackupTable />
          </div>
          <div className="button" title="Share" onClick={handleShare}>
            <FaShareAlt />
          </div>

          {user ? (
            <div className="button" title="Logout" onClick={handleLogout}>
              <IoLogOutOutline />
            </div>
          ) : (
            <Link to="/login" className="button" title="login">
              <CgProfile />
            </Link>
          )}

          {user &&
            (user.role === "admin" ||
              user.role === "editor" ||
              user.role === "atk") && (
              <Link
                to="/admin/admin-dashboard/flipbooks"
                className="button"
                title="Search"
              >
                <FaLock />
              </Link>
            )}

          {user &&
            user.role === "sub-admin" 
              && (
              <Link
                to="/user-panel"
                className="button"
                title="User-Panel"
              >
                <GrUserAdmin />
              </Link>
            )}
          {/* for now removed */}
          {/* <div className="button" title="Take Screenshot">
            <BiScreenshot onClick={onStartSnipping} />
          </div> */}
        </div>
      </header>

      {showShareModal && (
        <div
          className="share-modal-overlay"
          onClick={() => setShowShareModal(false)}
        >
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Link</h3>
              <button
                className="close-button"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="share-modal-content">
              <div className="url-container">
                <input type="text" readOnly value={window.location.href} />
                <button onClick={handleCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTocModal && (
        <div
          className="toc-modal-overlay"
          onClick={() => setShowTocModal(false)}
        >
          <div className="toc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="toc-modal-header">
              <h3>Table of Contents</h3>
              <button
                className="close-button"
                onClick={() => setShowTocModal(false)}
              >
                ×
              </button>
            </div>
            <div className="toc-modal-content">
              <div className="page-grid">
                {[
                  ...Array(bookRef?.current?.pageFlip().getPageCount() || 0),
                ].map((_, index) => (
                  <div
                    key={index}
                    className="page-preview"
                    onClick={() => {
                      bookRef.current.pageFlip().flip(index);
                      setShowTocModal(false);
                    }}
                  >
                    <div className="page-number">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
