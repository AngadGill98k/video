import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const Song = () => {
  const { state } = useLocation();
  const song = state?.song;
  const url = 'http://localhost:3001';

  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);

  if (!song) return <p>Song not found.</p>;

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${url}/get-user-playlists`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setPlaylists(data.playlists || []);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const res = await fetch(`${url}/add-song-to-playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          playlistId,
          songId: song._id,
        }),
      });

      const data = await res.json();
      console.log(data.msg);
      setShowModal(false); // hide modal after add
    } catch (err) {
      console.error('Failed to add song to playlist:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <h2>{song.video_name}</h2>
        <p>Uploaded by: <strong>{song.username}</strong></p>

       

        <div style={{ marginTop: '20px' }}>
          <video
  width="100%"
  height="300"
  controls
poster={`${url}${song.image_path}`}

>
<source src={`${url}${song.video_path}`} type="video/mp4" />

  Your browser does not support the video tag.
</video>

        </div>


        <button
          onClick={fetchPlaylists}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          ➕ Add to Playlist
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Select Playlist</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {playlists.map((p, idx) => (
                <li
                  key={idx}
                  onClick={() => handleAddToPlaylist(p._id)}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                >
                  {p.playlist_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Song;
