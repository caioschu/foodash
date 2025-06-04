import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserType } from '../../contexts/AuthContext';

type PrivateRouteProps = {
  children: React.ReactNode;
  userType?: UserType;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userType && user.userType !== userType) {
    // Redirecionar para a página inicial correta baseado no tipo de usuário
    const redirectPaths = {
      restaurant: '/',
      supplier: '/supplier',
      jobseeker: '/jobseeker'
    };
    return <Navigate to={redirectPaths[user.userType]} />;
  }

  return <>{children}</>;
};