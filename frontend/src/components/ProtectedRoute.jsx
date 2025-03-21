import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, checkingAuth } = useUserStore();

  // Show nothing while checking authentication
  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 