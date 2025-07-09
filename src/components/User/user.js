import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [userData, setUserData] = useState({
    username: '',
    videos: [],
    playlists: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/user', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
      })
      .catch(err => console.error('Failed to fetch user info:', err));
  }, []);

  const addSong = () => {
    navigate('/upload');
  };

  const addPlaylist = async () => {
    const playlistName = prompt('Enter playlist name:');
    if (!playlistName) return;

    try {
      const response = await fetch('http://localhost:3001/add-playlist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playlistName }),
      });

      const data = await response.json();
      if (data.msg === 'Playlist created') {
        // Update local state to show new playlist
        setUserData(prev => ({
          ...prev,
          playlists: [...prev.playlists, data.playlist],
        }));
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  const handleSongClick = (song) => {
    navigate('/song', { state: { song } });
  };

  const handlePlaylistClick = (playlist) => {
    navigate('/playlist', { state: { playlist } });
  };

  return (
    <>
      <Navbar />
      <div className="user-page" style={{ padding: '20px' }}>
        <h2>Welcome, {userData.username}</h2>

        <div className="user-section">
          <h3>Songs Created</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {userData.videos.map((song, index) => (
              <li
                key={index}
                onClick={() => handleSongClick(song)}
                style={{
                  marginBottom: '15px',
                  border: '1px solid #ccc',
                  padding: '10px',
                  cursor: 'pointer',
                  background: '#f9f9f9',
                  borderRadius: '8px'
                }}
              >
                {song.image_path && (
                  <img
                    src={`http://localhost:3001${song.image_path}`}
                    alt="Cover"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                )}
                <h4 style={{ marginTop: '10px' }}>{song.video_name}</h4>
              </li>
            ))}
          </ul>
          <button onClick={addSong}>Add Song</button>
        </div>

        <div className="user-section" style={{ marginTop: '30px' }}>
          <h3>Playlists</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {userData.playlists.map((playlist, index) => (
              <li
                key={index}
                onClick={() => handlePlaylistClick(playlist)}
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  background: '#f0f0f0'
                }}
                id={playlist._id}
              >
                {playlist.playlist_name}
              </li>
            ))}
          </ul>
          <button onClick={addPlaylist}>Add Playlist</button>
        </div>
      </div>
    </>
  );
};

export default User;
