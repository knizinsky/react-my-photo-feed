import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';
import { UserResponse } from '@supabase/supabase-js';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        const { data: userData } = await supabase
          .from('users')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUsername(userData.username || 'Użytkownik');
          setAvatarUrl(userData.avatar_url || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavLinks>
          <StyledLink to="/feed">Feed</StyledLink>
          <StyledLink to="/user">Profile</StyledLink>
          <StyledLink to="/posts">Posts</StyledLink>
          <StyledLink to="/user-list">Users</StyledLink>
        </NavLinks>
        
        {user ? (
          <UserSection>
            <Avatar src={avatarUrl || '/default-user-avatar.jpg'} alt="User Avatar" />
            <Username>{username}</Username>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserSection>
        ) : (
          <StyledLink to="/auth">Login</StyledLink>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem;
  background-color: #333;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
