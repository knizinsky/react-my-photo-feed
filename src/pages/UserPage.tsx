import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { getUser } from "../services/supabaseService";
import { User } from "@supabase/supabase-js";
import { Photo } from "../types/Photo";
import { Post } from "../types/Post";
import PhotoCard from "../components/PhotoCard";
import { handleDeletePhoto } from "../utils/photoUtils";
import Button, { PrimaryButton } from "../components/ui/Button";
import Input from "../components/ui/Input";
import { FileInput } from "../components/ui/FileUpload";
import ButtonsContainer from "../components/ui/ButtonsContainer";
import SubTitle from "../components/ui/SubTitle";
import LoadingSpinner from "../components/LoadingSpinner";

const UserPage = () => {
  const [user, setUser] = useState<User>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();

      if (user) {
        setUser(user);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (!userError && userData) {
          setUsername(userData.username || "Nie ustawiono");
          setAvatarUrl(userData.avatar_url || "");
        }

        const { data: photos } = await supabase
          .from("photos")
          .select("*")
          .eq("user_id", user.id);
        if (photos) setPhotos(photos);

        const { data: posts } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id);
        if (posts) setPosts(posts);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    try {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Błąd podczas przesyłania avatara.");
      return null;
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      newAvatarUrl = await handleAvatarUpload();
      if (!newAvatarUrl) return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ username, avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarUrl(newAvatarUrl);
      alert("Profil zaktualizowany pomyślnie!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Wystąpił błąd podczas aktualizacji profilu.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <div>Musisz być zalogowany, aby przeglądać tę stronę.</div>;

  return (
    <Container>
      <h1>Twój profil</h1>
      <ProfileSection>
        <SubTitle>
          Poniżej znajdują się informacje szczegółowe użytkownika, jego zdjęcia
          oraz posty.
        </SubTitle>
        <img
          className="user-avatar"
          src={avatarUrl || "/default-user-avatar.jpg"}
          alt="Avatar"
        />
        <UserDetailContainer>
          <p>
            <strong>Email:</strong>
            <UserDetail> {user.email}</UserDetail>
          </p>
          <p>
            <strong>Nazwa:</strong>
            <UserDetail>{username}</UserDetail>
          </p>
        </UserDetailContainer>

        {isEditing && (
          <ChangeUserDetailsSection>
            <ChangeUserDetailsContainer>
              <strong>Nowa nazwa:</strong>
              <Input
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </ChangeUserDetailsContainer>
            <ChangeUserDetailsContainer>
              <strong>Nowy avatar:</strong>
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </ChangeUserDetailsContainer>
            <ButtonsContainer>
              <PrimaryButton onClick={handleUpdateProfile}>
                Zapisz zmiany
              </PrimaryButton>
              <Button onClick={() => setIsEditing(false)}>Anuluj</Button>
            </ButtonsContainer>
          </ChangeUserDetailsSection>
        )}
        {!isEditing && (
          <PrimaryButton onClick={() => setIsEditing(true)}>
            Aktualizuj profil
          </PrimaryButton>
        )}
      </ProfileSection>

      <PhotosSection>
        <SectionTitle>Twoje zdjęcia</SectionTitle>
        <PhotoGrid>
          {photos.length > 0 ? (
            photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                userId={user.id}
                handleDeletePhoto={() =>
                  handleDeletePhoto(photo.id, setPhotos, photos)
                }
              />
            ))
          ) : (
            <SubTitle>Nie posiadasz żadnych zdjęć</SubTitle>
          )}
        </PhotoGrid>
      </PhotosSection>

      <PostsSection>
        <SectionTitle>Twoje posty</SectionTitle>
        <PostList>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </PostCard>
            ))
          ) : (
            <SubTitle>Nie posiadasz żadnych postów</SubTitle>
          )}
        </PostList>
      </PostsSection>
    </Container>
  );
};

export default UserPage;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

const ChangeUserDetailsContainer = styled.div`
  display: flex;
  gap: 10px;

  strong {
    max-width: 60px;
    text-align: center;
  }

  input[type="file"] {
    padding: 10px;
    border-radius: 8px;
    background: #ffffff17;
    backdrop-filter: blur(10px);
  }
`;

const ChangeUserDetailsSection = styled.div`
  display: flex;
  margin-bottom: 14px;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const UserDetailContainer = styled.div`
  display: flex;
  margin-bottom: 14px;
  flex-direction: column;
  align-items: center;
`;

const UserDetail = styled.span`
  color: #ffffffa4;
  display: inline-block;
  padding: 3px;
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileSection = styled.div`
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin: 20px 0 15px;
    box-shadow: 0 0 10px 1px #00000069;
  }
`;

const PhotosSection = styled.div`
  margin-bottom: 20px;
`;

const PhotoGrid = styled.div`
  display: flex;
  gap: 15px;
`;

const PostsSection = styled.div`
  margin-bottom: 20px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #4040408c;
  border-radius: 8px;
  padding: 20px 90px;
  text-align: center;
  background: #1d1d1d8f;
  box-shadow: 6px 8px 9px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff99;
  background-image: linear-gradient(309deg, #00000026, #ffffff12);
  margin: 5px 80px;

  h3 {
    color: #ffffffd1;
    margin-bottom: 10px;
  }
`;
