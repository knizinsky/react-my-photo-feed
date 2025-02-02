import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Upewnij się, że masz dostęp do klienta supabase

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Wylogowanie użytkownika z Supabase
      await supabase.auth.signOut();

      // Przekierowanie na stronę logowania (lub inną stronę)
      navigate('/auth');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
      <nav>
        <Link to="/feed" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
          Feed
        </Link>
        <Link to="/user" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
          Profile
        </Link>
        <Link to="/posts" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
          Posts
        </Link>
        <Link to="/user-list" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
          Users
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
