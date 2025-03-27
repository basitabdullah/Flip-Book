import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import './LoginPopup.scss';

const LoginPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { user, checkingAuth, isAuthenticated } = useUserStore();

  useEffect(() => {
    console.log('LoginPopup useEffect:', {
      checkingAuth,
      isAuthenticated,
      user,
      hasShownBefore: localStorage.getItem('loginPopupShown')
    });

    // Reset the popup shown state when user logs out
    if (!checkingAuth && !isAuthenticated && !user) {
      localStorage.removeItem('loginPopupShown');
    }

    // Only show popup if auth check is complete and user is not authenticated
    if (!checkingAuth && !isAuthenticated) {
      const hasShownBefore = localStorage.getItem('loginPopupShown');
      
      if (!hasShownBefore) {
        console.log('Setting up popup timer');
        const timer = setTimeout(() => {
          console.log('Timer finished, showing popup');
          setShowPopup(true);
          localStorage.setItem('loginPopupShown', 'true');
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [checkingAuth, isAuthenticated, user]);

  const handleClose = () => {
    console.log('Closing popup');
    setShowPopup(false);
    localStorage.setItem('loginPopupShown', 'true');
  };

  console.log('LoginPopup render:', { showPopup, checkingAuth });

  if (!showPopup || checkingAuth) return null;

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <div className="welcome-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="welcome-title">Welcome to G-Flip</h2>
        <p className="welcome-message">Sign in to explore our amazing e-catalog</p>
        <div className="popup-buttons">
          <Link to="/login" className="login-button">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login
          </Link>
          <button 
            className="close-button"
            onClick={handleClose}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup; 