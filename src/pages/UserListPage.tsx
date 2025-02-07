import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { User } from "../types/User";
import SubTitle from "../components/ui/SubTitle";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      let query = supabase.from("users").select("*");

      if (searchTerm) {
        query = query.ilike("username", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  return (
    <Container>
      <h1>Lista użytkowników</h1>
      <SubTitle>
        Poniżej znajduje się lista użytkowników. Możesz wyszukać danych
        użytkowników po nazwie.
      </SubTitle>
      <SearchSection>
        <Input
          type="text"
          placeholder="Wyszukaj po nazwie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchSection>

      <UserList>
        {users.map((user) => (
          <UserCard key={user.id}>
            <Avatar
              src={user?.avatar_url || "/default-user-avatar.jpg"}
              alt="User Avatar"
            />
            <p>
              <strong>Nazwa użytkownika:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Data rejestracji:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </UserCard>
        ))}
      </UserList>
    </Container>
  );
};

export default UserListPage;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SearchSection = styled.div`
  margin: 10px 0 26px;
  z-index: -10;
`;

const UserList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px 22px;
`;

const UserCard = styled.div`
  border: 1px solid #4040408c;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #ffffff14;
  box-shadow: 6px 8px 9px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff99;
  background-image: linear-gradient(309deg, #00000026, #ffffff12);
  width: 400px;

  p {
    margin: 5px 0;
  }
`;
