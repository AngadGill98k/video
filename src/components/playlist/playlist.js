import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const Playlist = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const playlist = state?.playlist;

  useEffect(() => {

    if (!playlist || !playlist.videos || playlist.videos.length === 0) return;

    // POST request to fetch full song documents by IDs
    fetch('http://localhost:3001/get-videos-by-ids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids: playlist.videos }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.videos)
  setSongs(data.videos || []);
})

      .catch(err => console.error('Failed to load songs:', err));
  }, [playlist]);

  const handleSongClick = (song) => {
    navigate('/song', { state: { song } });
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Playlist: {playlist?.playlist_name}</h2>

        {songs.length === 0 ? (
          <p>No songs in this playlist.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {songs.map((song, index) => (
              <li
                key={index}
                onClick={() => handleSongClick(song)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  padding: '10px',
                  cursor: 'pointer',
                  background: '#f9f9f9'
                }}
              >
                <img
                  src={`http://localhost:3001${song.image_path}`}
                  alt="Cover"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    marginRight: '15px'
                  }}
                />
                <div>
                  <h4 style={{ margin: '0 0 5px' }}>{song.song_name}</h4>
                  <p style={{ margin: 0, color: 'gray' }}>Uploaded by: {song.username}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Playlist;
