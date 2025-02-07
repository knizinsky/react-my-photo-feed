import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";
import { fetchAlbums, fetchPhotos, getUser } from "../services/supabaseService";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

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
      console.log("fetchPhotosAndAlbums > albums:", albums);
      setAlbums(albums);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(filePath);

      const { data, error } = await supabase.from("photos").insert([
        {
          url: publicUrl,
          description: newPhotoDescription,
          album_id: selectedAlbum,
          user_id: user.id,
        },
      ]);

      if (error) {
        throw error;
      }

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

  const handleDeletePhoto = async (photoId: string) => {
    const user = await getUser();

    if (!user) {
      alert("Musisz być zalogowany, aby usunąć zdjęcie.");
      return;
    }

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting photo:", error);
    } else {
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    }
  };

  return (
    <Container>
      <Header>
        <h1>Galeria zdjęć</h1>
        <SubTitle>
          Poniżej znajduje się galeria wszystkich dostępnych zdjęć dodanych
          przez użytkowników.
        </SubTitle>
      </Header>

      <ButtonsContainer>
        <div>
          {!showAddPhotoForm ? (
            !showAddAlbumForm ? (
              <PrimaryButton onClick={() => setShowAddPhotoForm(true)}>
                Dodaj zdjęcie
              </PrimaryButton>
            ) : null
          ) : (
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
              <StyledSelect
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
              >
                <StyledOption value="">Wybierz album</StyledOption>
                {albums.map((album) => (
                  <StyledOption key={album.id} value={album.id}>
                    {album.name}
                  </StyledOption>
                ))}
              </StyledSelect>
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
        </div>

        <div>
          {!showAddAlbumForm ? (
            !showAddPhotoForm ? (
              <Button onClick={() => setShowAddAlbumForm(true)}>
                Dodaj album
              </Button>
            ) : null
          ) : (
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
        </div>
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
            <PhotoCard key={photo.id}>
              <img src={photo.url} alt={photo.description} />
              <PhotoTitle>{photo.description}</PhotoTitle>
              <p>Album: {photo.albums?.name}</p>
              <p>Autor: {photo.users?.username}</p>
              {userId === photo.user_id && (
                <ButtonSmall onClick={() => handleDeletePhoto(photo.id)}>
                  <FontAwesomeIcon icon={faTrashCan} /> Usuń
                </ButtonSmall>
              )}
            </PhotoCard>
          ))}
      </PhotoGrid>
    </Container>
  );
};

export default FeedPage;

const SubHeader = styled.h2`
  margin: 0 36px 6px;
  color: #c6c6c6;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #cccccc9b;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  background: #ffffff17;
  backdrop-filter: blur(10px);
  color: #fff;
  &:focus {
    outline: 1px solid #ffffff92;
  }
`;

const StyledSelect = styled.select`
  padding: 10px;
  border: 1px solid #ffffff7e;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  background: #ffffff17;
  backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  position: relative;

  &::after {
    content: "▼";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    border-color: #d2d2d2;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const StyledOption = styled.option`
  color: #000;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &[selected] {
    background: linear-gradient(45deg, #88312a, #43155d);
    color: #fff;
  }

  &[value=""] {
    color: #b3b3b3;
  }

  &:hover {
    background: linear-gradient(45deg, #88312a, #43155d);
    color: #fff;
  }
`;

const DecisionButtons = styled.div`
  display: flex;
  gap: 12px;
  button {
    width: 100%;
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileInput = styled.input`
  &[type="file"] {
    border: 1px dashed #f2f2f2ac;
  }

  &[type="file"]::file-selector-button {
    font-family: "Geist", sans-serif;
    padding: 6px 12px;
    color: white;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
    transition: filter 0.3s;
    background-image: linear-gradient(272deg, #c6c6c6, #ffffff);
    color: #000000;

    &:hover {
      filter: brightness(1.2);
    }
  }
`;

const FileName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
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

const PhotoTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const SubTitle = styled.span`
  padding-top: 10px;
  color: #a4a4a4;
  display: block;
  max-width: 490px;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
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
    background: #ffffff17;
    backdrop-filter: blur(10px);
    color: #fff;
    border: 1px solid #ffffff7e;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const PhotoCard = styled.div`
  border: 1px solid #4040408c;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #ffffff14;
  box-shadow: 6px 8px 9px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff99;
  background-image: linear-gradient(309deg, #00000026, #ffffff12);

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #5a5a5a;
    max-height: 170px;
    box-shadow: 1px 14px 20px 0px #00000033;
  }

  p {
    margin: 10px 0;
  }
`;

const ButtonSmall = styled.button<{ secondary?: boolean }>`
  padding: 7px 13px;
  margin: 4px;
  background: ${({ secondary }) => (secondary ? "#6c757d" : "#007bff")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.3s;
  background-image: linear-gradient(272deg, #c6c6c6, #ffffff);
  color: #000000;
  box-shadow: 1px 14px 20px 0px #00000033;

  &:hover {
    filter: brightness(1.2);
  }

  & + & {
    margin-left: 10px;
  }

  svg {
    margin-right: 6px;
  }
`;

const Button = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  background: ${({ secondary }) => (secondary ? "#6c757d" : "#007bff")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.3s;
  background-image: linear-gradient(272deg, #c6c6c6, #ffffff);
  color: #000000;
  box-shadow: 1px 14px 20px 0px #0000001e;

  &:hover {
    filter: brightness(1.2);
  }

  & + & {
    margin-left: 10px;
  }

  svg {
    margin-right: 6px;
  }
`;

const PrimaryButton = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  background: ${({ secondary }) => (secondary ? "#6c757d" : "#007bff")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.3s;
  background-image: linear-gradient(45deg, #88312a, #43155d);
  box-shadow: 1px 14px 20px 0px #0000001e;

  &:hover {
    filter: brightness(1.2);
  }

  & + & {
    margin-left: 10px;
  }

  svg {
    margin-right: 6px;
  }
`;
