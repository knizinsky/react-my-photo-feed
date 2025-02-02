import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../services/supabaseService";
import { PrivateRouteProps } from "../types/PrivateRouteProps";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default PrivateRoute;
