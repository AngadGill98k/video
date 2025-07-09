import React, { useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const search = async () => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return;

  try {
    const response = await fetch(`http://localhost:3001/searching`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ input: trimmedQuery }),
    });

    const data = await response.json();
    console.log(data.msg, data.songs);

    navigate('/search', {
  state: { results: data.videos, query: trimmedQuery }
});

  } catch (err) {
    console.error('Search failed:', err);
  }
};

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const option = (target) => {
    navigate(`/${target}`);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="logo" onClick={() => option('home')}>
          CompanyName
        </div>

        <div className="search-bar">
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button onClick={search}>Search</button>

          </div>


        </div>

        <div className="nav-links">
      
          <span onClick={() => option('user')}>User</span>
     
        </div>
      </div>
    </div>
  );
};

export default Navbar;
