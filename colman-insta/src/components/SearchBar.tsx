import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (username: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(username);
        navigate(`/user/${username}`);
    };

    return (
        <form className="d-flex w-50 mx-auto" onSubmit={handleSearch}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="חפש משתמש"
                aria-label="Search"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">חפש</button>
        </form>
    );
};

export default SearchBar;
