import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ButtonSmall from "./ui/Button";

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    description: string;
    albums: { name: string };
    users: { username: string };
    user_id: string;
  };
  userId: string;
  handleDeletePhoto: (photoId: string) => void;
}

const PhotoCard = ({ photo, userId, handleDeletePhoto }: PhotoCardProps) => {
  return (
    <Card>
      <img src={photo.url} alt={photo.description} />
      <PhotoTitle>{photo.description}</PhotoTitle>
      <p>Album: {photo.albums?.name}</p>
      <p>Autor: {photo.users?.username}</p>
      {userId === photo.user_id && (
        <ButtonSmall onClick={() => handleDeletePhoto(photo.id)}>
          <FontAwesomeIcon icon={faTrashCan} /> Usuń
        </ButtonSmall>
      )}
    </Card>
  );
};

export default PhotoCard;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.cardText};
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

const PhotoTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;