import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import Input from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/Button";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      setError("");
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              username,
              created_at: new Date().toISOString(),
            },
          ]);

          if (insertError) throw insertError;
        }
      }

      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Form>
        <h2>{isLogin ? "Logowanie" : "Rejestracja"}</h2>
        {!isLogin && (
          <Input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Error>{error}</Error>}
        <PrimaryButton onClick={handleAuth}>
          {isLogin ? "Zaloguj się" : "Zarejestruj się"}
        </PrimaryButton>
        <Toggle onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Nie masz konta? Zarejestruj się!"
            : "Masz już konto? Zaloguj się!"}
        </Toggle>
      </Form>
    </Container>
  );
};

export default AuthPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.div`
  border: 1px solid #4040408c;
  border-radius: 8px;
  padding: 29px;
  text-align: center;
  background: #00000047;
  box-shadow: 6px 8px 9px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff99;
  background-image: linear-gradient(356deg, #00000014, #ffffff00);
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    color: #ffffffbd;
    margin-bottom: 6px;
    margin-top: -4px;
  }
`;

const Error = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const Toggle = styled.button`
  background: none;
  border: none;
  color: #d8d8d8;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
