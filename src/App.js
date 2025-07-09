import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import './App.css';

function App() {
  const [randomSongs, setRandomSongs] = useState([]);
  const navigate = useNavigate();
  const url = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${url}/random-videos`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setRandomSongs(data.videos || []);

      })
      .catch(err => console.error('Failed to fetch random songs:', err));
  }, []);

  const handleSongClick = (song) => {
    navigate('/song', { state: { song } });
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: '20px' }}>
        <h2>Recommended Songs</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {randomSongs.map((song, index) => (
            <div
              key={index}
              onClick={() => handleSongClick(song)}
              style={{
                width: '200px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#fafafa',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e6f7ff'}
              onMouseOut={e => e.currentTarget.style.background = '#fafafa'}
            >
              <img
                src={`${url}${song.image_path}`}
                alt="Cover"
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '5px'
                }}
              />
              <h4 style={{ margin: '10px 0 5px' }}>{song.video_name}</h4>
              <p style={{ margin: 0, color: 'gray' }}>Uploaded by: {song.username}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
