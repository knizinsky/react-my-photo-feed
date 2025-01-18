import { supabase } from '../supabaseClient';

export const checkSession = async () => {
  const { data: session } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
