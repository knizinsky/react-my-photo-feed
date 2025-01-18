import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddPhotoPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState('');

  const handleAddPhoto = async () => {
    const { data, error } = await supabase
      .from('photos')
      .insert([{ url, description, folder_id: folderId }]);

    if (error) console.error('Error adding photo:', error);
    else console.log('Photo added:', data);
  };

  return (
    <div>
      <h1>Add New Photo</h1>
      <input
        type="text"
        placeholder="Photo URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Folder ID"
        value={folderId}
        onChange={(e) => setFolderId(e.target.value)}
      />
      <button onClick={handleAddPhoto}>Add Photo</button>
    </div>
  );
};

export default AddPhotoPage;