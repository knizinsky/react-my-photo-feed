import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <h2>404 - Nie znaleziono strony.</h2>
      <Link to="/feed">Wróć do strony głównej</Link>
    </>
  );
};

export default NotFoundPage;
