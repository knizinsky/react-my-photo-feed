import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CheckSession: () => ReactNode = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/auth");
      }
    };

    checkSession();
  }, [navigate]);

  return null;
};

export default CheckSession;