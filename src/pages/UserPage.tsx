import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';

const UserPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobierz dane użytkownika, zdjęcia i posty
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('fetchUserData > user:', user);

      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');

        // Pobierz zdjęcia użytkownika
        const { data: photos, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .eq('user_id', user.id);

        if (photosError) {
          console.error('Error fetching photos:', photosError);
        } else {
          setPhotos(photos);
        }

        // Pobierz posty użytkownika
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id);

        if (postsError) {
          console.error('Error fetching posts:', postsError);
        } else {
          setPosts(posts);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Aktualizacja danych użytkownika
  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      // Aktualizuj metadane użytkownika w Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { username, avatar_url: avatarUrl },
      });

      if (authError) throw authError;

      // Aktualizuj dane użytkownika w tabeli `users`
      const { error: dbError } = await supabase
        .from('users')
        .update({ username, avatar_url: avatarUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      alert('Profil zaktualizowany pomyślnie!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Wystąpił błąd podczas aktualizacji profilu.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Musisz być zalogowany, aby przeglądać tę stronę.</div>;
  }

  return (
    <Container>
      <h1>Twój profil</h1>

      {/* Sekcja informacji o użytkowniku */}
      <ProfileSection>
        <h2>Informacje o użytkowniku</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User name:</strong> {user.user_metadata.username}</p>
        <p><strong>Avatar:</strong> <img className='user-avatar' src={user.user_metadata.avatar_url}  /></p>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL avatara"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <button onClick={handleUpdateProfile}>Aktualizuj profil</button>
      </ProfileSection>

      {/* Sekcja zdjęć użytkownika */}
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

      {/* Sekcja postów użytkownika */}
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

// Stylowanie
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
  }

  button:hover {
    background: #0056b3;
  }

  .user-avatar{
    width: 60px;
    height: 60px;
    border-radius: 50%;
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