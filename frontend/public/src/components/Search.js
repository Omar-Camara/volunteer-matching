import React, { useState, useEffect } from 'react';

const Search = ({ onSearch }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        console.log("Triggering search with:", { title, location }); // Debug here
        onSearch({ title, location });
    };

    useEffect(() => {
        onSearch({ title, location }); // Trigger search whenever input changes
    }, [title, location]); // Run effect when title or location changes

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by title"
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location"
            />
            <button
                onClick={handleSearch}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Search
            </button>
        </div>
    );
};

export default Search;
