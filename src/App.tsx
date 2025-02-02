import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import { supabase } from './supabaseClient';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';
import FoldersPage from './pages/FoldersPage';
import AddPhotoPage from './pages/AddPhotoPage';
import DeletePhotoPage from './pages/DeletePhotoPage';
import UserListPage from './pages/UserListPage';
import ImageListPage from './pages/ImageListPage';
import PostsPage from './pages/PostsPage';

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
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Layout>
                <FeedPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <Layout>
                <UserPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-list"
          element={
            <PrivateRoute>
              <Layout>
                <UserListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/image-list"
          element={
            <PrivateRoute>
              <Layout>
                <ImageListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <PrivateRoute>
              <Layout>
                <PostsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;