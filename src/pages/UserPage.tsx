import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { getUser } from "../services/supabaseService";
import { User } from "@supabase/supabase-js";
import { Photo } from "../types/Photo";
import { Post } from "../types/Post";

const UserPage: React.FC = () => {
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
        .from("avatars") // Bucket 'avatars' musi istnieć
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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Musisz być zalogowany, aby przeglądać tę stronę.</div>;

  return (
    <Container>
      <h1>Twój profil</h1>
      <ProfileSection>
        <h2>Informacje o użytkowniku</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User name:</strong> {username}
        </p>
        <p>
          <strong>Avatar:</strong>
        </p>
        <img
          className="user-avatar"
          src={avatarUrl || "/default-user-avatar.jpg"}
          alt="Avatar"
        />

        {isEditing && (
          <>
            <input
              type="text"
              placeholder="Nazwa użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
            <button onClick={handleUpdateProfile}>Zapisz zmiany</button>
          </>
        )}
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}>Aktualizuj profil</button>
        )}
      </ProfileSection>

      <PhotosSection>
        <h2>Twoje zdjęcia</h2>
        <PhotoGrid>
          {photos.map((photo) => (
            <PhotoCard key={photo.id}>
              <img src={photo.url} alt={photo.description} />
              <p>{photo.description}</p>
            </PhotoCard>
          ))}
        </PhotoGrid>
      </PhotosSection>

      <PostsSection>
        <h2>Twoje posty</h2>
        <PostList>
          {posts.map((post) => (
            <PostCard key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </PostCard>
          ))}
        </PostList>
      </PostsSection>
    </Container>
  );
};

export default UserPage;

// Stylizacja
const Container = styled.div`
  padding: 20px;
`;

const ProfileSection = styled.div`
  margin-bottom: 20px;

  input {
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  button:hover {
    background: #0056b3;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 10px;
  }
`;

const PhotosSection = styled.div`
  margin-bottom: 20px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const PhotoCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;

  h3 {
    margin: 0;
  }
`;
