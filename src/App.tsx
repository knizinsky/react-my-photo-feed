import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import AppRoutes from "./routes/routes";

const CheckSession: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      await supabase.auth.getSession();
    };

    checkSession();
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <CheckSession />
      <AppRoutes />
    </Router>
  );
};

export default App;