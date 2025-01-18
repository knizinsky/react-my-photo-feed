import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import { supabase } from './supabaseClient';

const CheckSession: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate('/feed');
      }
    };

    checkSession();
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <CheckSession />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <h1>Feed</h1>
              {/* <FeedPage /> */}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
