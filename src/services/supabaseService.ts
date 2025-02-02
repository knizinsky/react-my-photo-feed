import { supabase } from "../supabaseClient";

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const fetchPhotos = async () => {
  const { data: photos, error } = await supabase
    .from("photos")
    .select(
      "*, albums!photos_album_id_fkey(name), users!photos_user_id_fkey(username)"
    );
  if (error) throw error;
  return photos;
};

export const fetchAlbums = async () => {
  const { data: albums, error } = await supabase.from("albums").select("*");
  if (error) throw error;
  return albums;
};
