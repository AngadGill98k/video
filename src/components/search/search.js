import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const Search = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const url = 'http://localhost:3001';

  const results = state?.results || [];
  const query = state?.query || '';

  const handleClick = (song) => {
    navigate('/song', { state: { song } });
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Search Results for: "{query}"</h2>

        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {results.map((song, index) => (
              <div
                key={index}
                onClick={() => handleClick(song)}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '15px',
                  cursor: 'pointer',
                  background: '#f9f9f9',
                }}
              >
                <img
                  src={`${url}${song.image_path}`}
                  alt="Cover"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <h4 style={{ margin: '10px 0 5px' }}>{song.video_name}</h4>
                <p style={{ margin: 0, color: 'gray' }}>Uploaded by: {song.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
