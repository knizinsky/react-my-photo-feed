import { Dispatch, SetStateAction } from "react";
import { getUser } from "../services/supabaseService";
import { supabase } from "../supabaseClient";
import { Photo } from "../types/Photo";

export const handleDeletePhoto = async (
  photoId: string,
  setPhotos: Dispatch<SetStateAction<Photo[]>>,
  photos: Photo[]
) => {
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
