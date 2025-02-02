import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { User } from "../types/User";

const UserListPage: React.FC = () => {
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

      <SearchSection>
        <input
          type="text"
          placeholder="Wyszukaj użytkownika po nazwie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchSection>

      <UserList>
        {users.map((user) => (
          <UserCard key={user.id}>
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
`;

const SearchSection = styled.div`
  margin-bottom: 20px;

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #f9f9f9;

  p {
    margin: 5px 0;
  }
`;
