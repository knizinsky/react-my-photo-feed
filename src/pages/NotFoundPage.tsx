import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <h2>404 - Page Not Found</h2>
      <Link to="/feed">Go back to Feed</Link>
    </>
  );
};

export default NotFoundPage;
