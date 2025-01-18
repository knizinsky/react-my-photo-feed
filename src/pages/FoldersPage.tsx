import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const FoldersPage: React.FC = () => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      let { data: folders, error } = await supabase
        .from('folders')
        .select('*');

      if (error) console.error('Error fetching folders:', error);
      else setFolders(folders);
    };

    fetchFolders();
  }, []);

  const handleAddFolder = async () => {
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name: newFolderName }]);

    if (error) {
      console.error('Error adding folder:', error);
    } else {
      console.log('Inserted folder data:', data);
      setFolders((prevFolders) => [...prevFolders, ...data]);
      setNewFolderName('');
    }
  };

  return (
    <div>
      <h1>Your Folders</h1>
      <input
        type="text"
        placeholder="New Folder Name"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
      />
      <button onClick={handleAddFolder}>Add Folder</button>
      <div>
        {folders.map((folder) => (
          <div key={folder.id}>
            <h2>{folder.name}</h2>
            {/* Link to folder's photos */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoldersPage;
