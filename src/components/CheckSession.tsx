import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const CheckSession: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      await supabase.auth.getSession();
    };

    checkSession();
  }, [navigate]);

  return null;
};

export default CheckSession;