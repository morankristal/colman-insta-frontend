// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface SearchBarProps {
//     onSearch: (username: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
//     const [username, setUsername] = useState('');
//     const navigate = useNavigate();

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSearch(username); // Trigger the search in the parent component
//         navigate(`/user/${username}`); // Navigate to the user profile page
//     };

//     return (
//         <form className="d-flex w-50 mx-auto" onSubmit={handleSearch}>
//             <input
//                 className="form-control me-2"
//                 type="search"
//                 placeholder="חפש משתמש"
//                 aria-label="Search"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)} // Update username as the user types
//             />
//             <button className="btn btn-outline-success" type="submit">חפש</button>
//         </form>
//     );
// };

// export default SearchBar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (username: string) => void;
    searchResults: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchResults }) => {
    const [username, setUsername] = useState('');
    const [debouncedUsername, setDebouncedUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedUsername(username);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username]);

    useEffect(() => {
        if (debouncedUsername.trim() !== '') {
            onSearch(debouncedUsername);
        }
    }, [debouncedUsername, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleUserClick = (user: string) => {
        navigate(`/user/${user}`); 
    };

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <form className="d-flex w-100" onSubmit={(e) => e.preventDefault()}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="חפש משתמש"
                    value={username}
                    onChange={handleInputChange}
                    style={{
                        borderRadius: '10px',
                        padding: '10px',
                        border: '1px solid #ccc',
                    }}
                />
            </form>

            {debouncedUsername.trim() && searchResults.length > 0 && (
                <ul className="list-group mt-2" style={{ borderRadius: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {searchResults.map((user) => (
                        <li
                            key={user}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleUserClick(user)}
                            style={{ cursor: 'pointer', padding: '8px 15px', borderRadius: '8px' }}
                        >
                            {user}
                        </li>
                    ))}
                </ul>
            )}

            {debouncedUsername.trim() && searchResults.length === 0 && (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default SearchBar;