import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser, canAccessRoute } from '../utils/roleUtils';

function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  
  // Check if user is logged in
  const isAuthenticated = () => {
    const user = getUser();
    return user !== null && user !== undefined;
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole) {
    const user = getUser();
    if (user && user.role !== requiredRole) {
      // Redirect to dashboard if role doesn't match
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check if current route is accessible for user's role
  if (!canAccessRoute(location.pathname)) {
    // Redirect to dashboard if route is not accessible
    return <Navigate to="/dashboard" replace />;
  }

  // Render protected component if authenticated and authorized
  return children;
}

export default ProtectedRoute;

