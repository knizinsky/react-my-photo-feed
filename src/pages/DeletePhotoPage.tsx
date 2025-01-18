import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const DeletePhotoPage: React.FC = () => {
  const [photoId, setPhotoId] = useState('');

  const handleDeletePhoto = async () => {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (error) console.error('Error deleting photo:', error);
    else console.log('Photo deleted');
  };

  return (
    <div>
      <h1>Delete Photo</h1>
      <input
        type="text"
        placeholder="Photo ID"
        value={photoId}
        onChange={(e) => setPhotoId(e.target.value)}
      />
      <button onClick={handleDeletePhoto}>Delete Photo</button>
    </div>
  );
};

export default DeletePhotoPage;