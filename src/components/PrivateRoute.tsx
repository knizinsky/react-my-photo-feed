import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false); 
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    // Pokaż loading, dopóki nie sprawdzimy sesji
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Jeśli nie ma sesji, przekieruj do strony logowania
    return <Navigate to="/auth" />;
  }

  return children;
};


export default PrivateRoute;
