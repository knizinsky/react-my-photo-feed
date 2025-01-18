import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const FeedPage: React.FC = () => {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      let { data: photos, error } = await supabase
        .from('photos')
        .select('*')
        .ilike('description', `%${filter}%`);

      if (error) console.error('Error fetching photos:', error);
      else setPhotos(photos);
    };

    fetchPhotos();
  }, [filter]);

  return (
    <div>
      <h1>Welcome to the Feed!</h1>
      <input
        type="text"
        placeholder="Filter photos"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img src={photo.url} alt={photo.description} />
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
