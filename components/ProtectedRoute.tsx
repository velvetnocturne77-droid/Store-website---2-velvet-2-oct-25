
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useStore();

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
