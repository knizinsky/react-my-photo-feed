import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/feed">Go back to Feed</Link>
    </div>
  );
};

export default NotFoundPage;
