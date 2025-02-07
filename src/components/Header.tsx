import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { UserResponse } from "@supabase/supabase-js";
import { getUser, signOut } from "../services/supabaseService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faComments,
  faImages,
  faRightFromBracket,
  faSquareShareNodes,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();

      if (user) {
        setUser(user);

        const { data: userData } = await supabase
          .from("users")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (userData) {
          setUsername(userData.username || "Użytkownik");
          setAvatarUrl(userData.avatar_url || "");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavLinks>
          <LogoContainer>
            <LinkContainer>
              <FontAwesomeIcon icon={faSquareShareNodes} />
              <StyledLink to="/feed">Social Photo</StyledLink>
            </LinkContainer>
          </LogoContainer>
          <Separator> | </Separator>
          <LinkContainer>
            <FontAwesomeIcon icon={faImages} />
            <StyledLink to="/feed">Zdjęcia</StyledLink>
          </LinkContainer>
          <LinkContainer>
            <FontAwesomeIcon icon={faAddressCard} />
            <StyledLink to="/user">Profil</StyledLink>
          </LinkContainer>
          <LinkContainer>
            <FontAwesomeIcon icon={faComments} />
            <StyledLink to="/posts">Posty</StyledLink>
          </LinkContainer>
          <LinkContainer>
            <FontAwesomeIcon icon={faUserGroup} />
            <StyledLink to="/user-list">Użytkownicy</StyledLink>
          </LinkContainer>
        </NavLinks>

        {user ? (
          <UserSection>
            <Avatar
              src={avatarUrl || "/default-user-avatar.jpg"}
              alt="User Avatar"
            />
            <Username>{username}</Username>
            <LogoutContainer>
              <LogoutButton onClick={handleLogout}>Wyloguj</LogoutButton>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </LogoutContainer>
          </UserSection>
        ) : (
          <StyledLink to="/auth">Login</StyledLink>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

const Separator = styled.span`
  color: #ababab;
`;

const LogoContainer = styled.div`
  margin-left: 22px;
  div a {
    color: white;
    font-weight: 600;
  }
`;

const LinkContainer = styled.div`
  color: #ababab;
  a {
    margin-left: 8px;
    color: #ababab;
  }
`;

const LogoutContainer = styled.div`
  * {
    color: #ababab;
  }

  button {
    color: #ababab;
    padding-right: 10px;
  }
`;

const HeaderContainer = styled.header`
  width: 100%;
  padding: 10px;
  background-color: #ffffff0a;
  color: white;
  backdrop-filter: blur(10px);
  background: radial-gradient(#ffffff05, #ffffff00) 101%;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
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
  margin: 0 12px;
`;

const Avatar = styled.img`
  width: 37px;
  height: 37px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px #0000006e;
`;

const Username = styled.span`
  font-size: 16px;
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
