import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ImageListPage: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [searchId, setSearchId] = useState('');
  const [searchAlbum, setSearchAlbum] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      let query = supabase.from('photos').select('*');

      if (searchId) {
        query = query.eq('id', searchId);
      }

      if (searchAlbum) {
        query = query.eq('album_id', searchAlbum);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data);
      }
    };

    fetchPhotos();
  }, [searchId, searchAlbum]);

  return (
    <div>
      <h1>Image List</h1>
      <input
        type="text"
        placeholder="Search by Photo ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search by Album ID"
        value={searchAlbum}
        onChange={(e) => setSearchAlbum(e.target.value)}
      />
      <div>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img src={photo.url} alt={photo.description} style={{ width: '200px', height: '200px' }} />
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageListPage;