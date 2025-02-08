import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { fetchAlbums, fetchPhotos, getUser } from "../services/supabaseService";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button, { PrimaryButton } from "../components/ui/Button";
import PhotoCard from "../components/PhotoCard";
import Input from "../components/ui/Input";
import { Select, Option } from "../components/ui/Select";
import {
  FileInputContainer,
  FileInput,
  FileName,
} from "../components/ui/FileUpload";
import { handleDeletePhoto } from "../utils/photoUtils";
import ButtonsContainer from "../components/ui/ButtonsContainer";
import SubTitle from "../components/ui/SubTitle";
import LoadingSpinner from "../components/LoadingSpinner";

const FeedPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filterUser, setFilterUser] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState<File>(null);
  const [newPhotoDescription, setNewPhotoDescription] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showAddAlbumForm, setShowAddAlbumForm] = useState(false);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [userId, setUserId] = useState<string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchPhotosAndAlbums();
  }, []);

  const fetchPhotosAndAlbums = async () => {
    try {
      const [fetchedPhotos, fetchedAlbums] = await Promise.all([
        fetchPhotos(),
        fetchAlbums(),
      ]);
      setPhotos(fetchedPhotos);
      setAlbums(fetchedAlbums);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotosAndAlbums();
  }, []);

  const handleAddPhoto = async () => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby dodać zdjęcie.");
      return;
    }

    if (!newPhotoFile || !selectedAlbum) {
      alert("Proszę wybrać plik i album.");
      return;
    }

    try {
      const fileExt = newPhotoFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, newPhotoFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(filePath);

      const { error } = await supabase.from("photos").insert([
        {
          url: publicUrl,
          description: newPhotoDescription,
          album_id: selectedAlbum,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      await fetchPhotosAndAlbums();
      setNewPhotoFile(null);
      setNewPhotoDescription("");
      setSelectedAlbum("");
      setShowAddPhotoForm(false);
    } catch (error) {
      console.error("Error adding photo:", error);
      alert("Wystąpił błąd podczas dodawania zdjęcia.");
    }
  };

  const handleAddAlbum = async () => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby dodać album.");
      return;
    }

    if (!newAlbumName) {
      alert("Proszę podać nazwę albumu.");
      return;
    }

    const { data, error } = await supabase
      .from("albums")
      .insert([{ name: newAlbumName, user_id: user.id }]);

    if (error) {
      console.error("Error adding album:", error);
    } else {
      setAlbums([...albums, ...data]);
      setNewAlbumName("");
      setShowAddAlbumForm(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <Header>
        <MainHeader>Galeria zdjęć</MainHeader>
        <SubTitle>
          Poniżej znajduje się galeria wszystkich dostępnych zdjęć dodanych
          przez użytkowników.
        </SubTitle>
      </Header>

      <ButtonsContainer>
        {!showAddPhotoForm && !showAddAlbumForm && (
          <>
            <PrimaryButton onClick={() => setShowAddPhotoForm(true)}>
              Dodaj zdjęcie
            </PrimaryButton>
            <Button onClick={() => setShowAddAlbumForm(true)}>
              Dodaj album
            </Button>
          </>
        )}

        {showAddPhotoForm && (
          <PhotoForm>
            <SubHeader>Dodaj nowe zdjęcie</SubHeader>
            <FileInputContainer>
              <FileInput
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhotoFile(e.target.files?.[0] || null)}
              />
              {newPhotoFile && <FileName>{newPhotoFile.name}</FileName>}
            </FileInputContainer>
            <Input
              type="text"
              placeholder="Opis zdjęcia"
              value={newPhotoDescription}
              onChange={(e) => setNewPhotoDescription(e.target.value)}
            />
            <Select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
            >
              <Option value="">Wybierz album</Option>
              {albums.map((album) => (
                <Option key={album.id} value={album.id}>
                  {album.name}
                </Option>
              ))}
            </Select>
            <DecisionButtons>
              <PrimaryButton onClick={handleAddPhoto}>
                <FontAwesomeIcon icon={faPlus} /> Dodaj zdjęcie
              </PrimaryButton>
              <Button secondary onClick={() => setShowAddPhotoForm(false)}>
                Anuluj
              </Button>
            </DecisionButtons>
          </PhotoForm>
        )}

        {showAddAlbumForm && (
          <AlbumForm>
            <SubHeader>Dodaj nowy album</SubHeader>
            <Input
              type="text"
              placeholder="Nazwa albumu"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
            />
            <DecisionButtons>
              <PrimaryButton onClick={handleAddAlbum}>
                Dodaj album
              </PrimaryButton>
              <Button secondary onClick={() => setShowAddAlbumForm(false)}>
                Anuluj
              </Button>
            </DecisionButtons>
          </AlbumForm>
        )}
      </ButtonsContainer>

      <FilterSection>
        <FilterContainer>
          {!filterUser && <SearchIcon icon={faSearch} />}
          <FilterWrapper>
            {!filterUser && (
              <PlaceholderText>Filtruj po użytkowniku</PlaceholderText>
            )}
            <FilterInput
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            />
          </FilterWrapper>
        </FilterContainer>
      </FilterSection>

      <PhotoGrid>
        {photos
          .filter(
            (photo) =>
              !filterUser ||
              photo.users?.username
                .toLowerCase()
                .includes(filterUser.toLowerCase())
          )
          .map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              userId={userId}
              handleDeletePhoto={() =>
                handleDeletePhoto(photo.id, setPhotos, photos)
              }
            />
          ))}
      </PhotoGrid>
    </Container>
  );
};

export default FeedPage;

const MainHeader = styled.h1`
  margin: 0 36px 6px;
  color: #ffffff;
`;
const SubHeader = styled.h2`
  margin: 0 36px 6px;
  color: #c6c6c6;
`;

const DecisionButtons = styled.div`
  display: flex;
  gap: 12px;
  button {
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 2px;
`;

const FilterWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const PlaceholderText = styled.span`
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  pointer-events: none;
  font-size: 14px;
`;

const FilterInput = styled.input`
  background: none;
  width: 100%;
  padding: 10px 10px 10px 20px;
  border: 1px solid #4e4e4e;
  color: #fff;
  border-radius: 4px;

  &:focus + ${PlaceholderText} {
    display: none;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;

  input {
    padding: 10px;
    border: 1px solid #4e4e4e;
    color: #fff;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
  }
`;

const AlbumForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    padding: 10px;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
  }
`;

const PhotoForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  select {
    padding: 10px;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
    background: ${({ theme }) => theme.colors.inputBackground};
    backdrop-filter: blur(10px);
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;
