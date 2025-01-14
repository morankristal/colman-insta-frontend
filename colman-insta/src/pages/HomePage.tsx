// src/pages/HomePage.tsx
import React from 'react';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
    const handleSearch = (username: string) => {
        console.log(`Searching for user: ${username}`);
        // כאן אפשר לשלב חיפוש באמצעות API או נתונים מקומיים
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex justify-content-center">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </nav>

            <div className="container mt-4">
                <h2>ברוך הבא לאפליקציית המשתמשים</h2>
                <p>השתמש בשורת החיפוש למעלה כדי לחפש משתמשים ולהציג את פרטי המשתמש.</p>
            </div>
        </div>
    );
};

export default HomePage;
