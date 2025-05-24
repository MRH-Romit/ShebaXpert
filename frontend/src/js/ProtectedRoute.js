import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = '/login'
}) => {
  const { user, loading } = useAuth();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectPath} />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  // If there are children, render them, otherwise render the Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;