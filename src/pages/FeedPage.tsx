import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';
import { fetchAlbums, fetchPhotos, getUser } from '../services/supabaseService';
import { Photo } from '../types/Photo';

const FeedPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<[]>([]);
  const [filterUser, setFilterUser] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null); // Plik zdjęcia
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showAddAlbumForm, setShowAddAlbumForm] = useState(false);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchPhotosAndAlbums = async () => {
    try {
      const photos = await fetchPhotos();
      setPhotos(photos);

      const albums = await fetchAlbums();
      setAlbums(albums);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPhotosAndAlbums();
  }, []);

  const handleAddPhoto = async () => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby dodać zdjęcie.');
      return;
    }

    if (!newPhotoFile || !selectedAlbum) {
      alert('Proszę wybrać plik i album.');
      return;
    }

    try {
      // Prześlij plik do Supabase Storage
      const fileExt = newPhotoFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos') // Nazwa bucketu w Supabase Storage
        .upload(filePath, newPhotoFile);


      // Pobierz publiczny URL przesłanego pliku
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Dodaj zdjęcie do tabeli `photos`
      const { data, error } = await supabase
        .from('photos')
        .insert([{ url: publicUrl, description: newPhotoDescription, album_id: selectedAlbum, user_id: user.id }]);

      if (error) {
        throw error;
      }

      // Po dodaniu zdjęcia, ponownie pobierz zdjęcia z bazy danych
      await fetchPhotosAndAlbums();
      setNewPhotoFile(null);
      setNewPhotoDescription('');
      setSelectedAlbum('');
      setShowAddPhotoForm(false);
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Wystąpił błąd podczas dodawania zdjęcia.');
    }
  };

  const handleAddAlbum = async () => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby dodać album.');
      return;
    }

    if (!newAlbumName) {
      alert('Proszę podać nazwę albumu.');
      return;
    }

    const { data, error } = await supabase
      .from('albums')
      .insert([{ name: newAlbumName, user_id: user.id }]);

    if (error) {
      console.error('Error adding album:', error);
    } else {
      setAlbums([...albums, ...data]);
      setNewAlbumName('');
      setShowAddAlbumForm(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const user = await getUser();

    if (!user) {
      alert('Musisz być zalogowany, aby usunąć zdjęcie.');
      return;
    }

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting photo:', error);
    } else {
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    }
  };

  return (
    <Container>
      <h1>Feed</h1>

      <FilterSection>
        <input
          type="text"
          placeholder="Filtruj po użytkowniku"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        />
      </FilterSection>

      <AddAlbumSection>
        {!showAddAlbumForm ? (
          <button onClick={() => setShowAddAlbumForm(true)}>Dodaj album</button>
        ) : (
          <>
            <h2>Dodaj nowy album</h2>
            <input
              type="text"
              placeholder="Nazwa albumu"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
            />
            <button onClick={handleAddAlbum}>Dodaj album</button>
            <button onClick={() => setShowAddAlbumForm(false)}>Anuluj</button>
          </>
        )}
      </AddAlbumSection>

      <AddPhotoSection>
        {!showAddPhotoForm ? (
          <button onClick={() => setShowAddPhotoForm(true)}>Dodaj zdjęcie</button>
        ) : (
          <>
            <h2>Dodaj nowe zdjęcie</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhotoFile(e.target.files?.[0] || null)}
            />
            <input
              type="text"
              placeholder="Opis zdjęcia"
              value={newPhotoDescription}
              onChange={(e) => setNewPhotoDescription(e.target.value)}
            />
            <select value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)}>
              <option value="">Wybierz album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddPhoto}>Dodaj zdjęcie</button>
            <button onClick={() => setShowAddPhotoForm(false)}>Anuluj</button>
          </>
        )}
      </AddPhotoSection>

      <PhotoGrid>
        {photos.map((photo) => (
          filterUser ? photo.users?.username.toLowerCase().includes(filterUser.toLowerCase()) ? (
            <PhotoCard key={photo.id}>
              <img src={photo.url} alt={photo.description} />
              <p>{photo.description}</p>
              <p>Album: {photo.albums?.name}</p>
              <p>Autor: {photo.users?.username}</p>
              <button onClick={() => handleDeletePhoto(photo.id)}>Usuń</button>
            </PhotoCard>
          ) : '' : (
            <PhotoCard key={photo.id}>
              <img src={photo.url} alt={photo.description} />
              <p>{photo.description}</p>
              <p>Album: {photo.albums?.name}</p>
              <p>Autor: {photo.users?.username}</p>
              {userId === photo.user_id && (
                <button onClick={() => handleDeletePhoto(photo.id)}>Usuń</button>
              )}
            </PhotoCard>
          )
        ))}
      </PhotoGrid>
    </Container>
  );
};

export default FeedPage;

// Stylowanie
const Container = styled.div`
  padding: 20px;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }
`;

const AddAlbumSection = styled.div`
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
    margin-right: 10px;
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #218838;
  }
`;

const AddPhotoSection = styled.div`
  margin-bottom: 20px;

  input, select {
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }

  button {
    margin-right: 10px;
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

  button {
    margin-top: 10px;
    padding: 5px 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #c82333;
  }
`;