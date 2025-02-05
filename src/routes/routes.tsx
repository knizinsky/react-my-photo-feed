import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import PrivateRoute from "../components/PrivateRoute";
import Layout from "../components/Layout";
import FeedPage from "../pages/FeedPage";
import UserPage from "../pages/UserPage";
import UserListPage from "../pages/UserListPage";
import PostsPage from "../pages/PostsPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
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
  );
};

export default AppRoutes;
