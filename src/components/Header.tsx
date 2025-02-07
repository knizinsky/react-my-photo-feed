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
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "./ui/Avatar";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <MenuIcon onClick={toggleMenu}>
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </MenuIcon>
          <LinksContainer isMenuOpen={isMenuOpen}>
            <LinkContainer>
              <FontAwesomeIcon icon={faImages} />
              <StyledLink to="/feed" onClick={toggleMenu}>
                Zdjęcia
              </StyledLink>
            </LinkContainer>
            <LinkContainer>
              <FontAwesomeIcon icon={faAddressCard} />
              <StyledLink to="/user" onClick={toggleMenu}>
                Profil
              </StyledLink>
            </LinkContainer>
            <LinkContainer>
              <FontAwesomeIcon icon={faComments} />
              <StyledLink to="/posts" onClick={toggleMenu}>
                Posty
              </StyledLink>
            </LinkContainer>
            <LinkContainer>
              <FontAwesomeIcon icon={faUserGroup} />
              <StyledLink to="/user-list" onClick={toggleMenu}>
                Użytkownicy
              </StyledLink>
            </LinkContainer>
          </LinksContainer>
        </NavLinks>

        {user ? (
          <UserSection>
            <Avatar
              src={avatarUrl || "/default-user-avatar.jpg"}
              alt="User Avatar"
            />
            <Username>
              <StyledLink to="/user">{username}</StyledLink>
            </Username>
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

    @media (max-width: 576px) {
      display: none;
    }
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
  align-items: center;

  @media (max-width: 992px) {
    gap: 15px;
  }
`;

const LinksContainer = styled.div<{ isMenuOpen: boolean }>`
  display: flex;
  gap: 30px;

  @media (max-width: 992px) {
    display: ${({ isMenuOpen }) => (isMenuOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    background: #1b1b1b;
    width: 100%;
    padding: 10px 20px;
    backdrop-filter: blur(10px);
  }
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

const Username = styled.span`
  font-size: 16px;

  @media (max-width: 992px) {
    display: none;
  }
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

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 992px) {
    display: block;
  }
`;
