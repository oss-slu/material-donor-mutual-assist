import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');

        if (token && name) {
            setIsLoggedIn(true);
            setUser(name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setIsLoggedIn(false);
        setUser('');
        window.location.href = "/";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src="/bworks.png" alt="Description of the image" style={{ width: '100px', height: '50px' }} /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isLoggedIn && (
                            <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                                <span>Welcome {user}!</span>
                            </li>
                        )}
                        {!isLoggedIn && (
                          <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                              {/* Use Link component for navigation */}
                              <Link className="nav-link active" aria-current="page" to="/login">Login</Link>
                          </li>
                        )}
                        {!isLoggedIn && (
                          <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                              {/* Use Link component for navigation */}
                              <Link className="nav-link active" aria-current="page" to="/register">Register</Link>
                          </li>
                        )}
                        <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                            <Link className="nav-link" to="/about">About</Link> {/* Example link for About page */}
                        </li>
                        <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                            <Link className="nav-link" to="/donations">Donations</Link> {/* Example link for About page */}
                        </li>
                    </ul>
                </div>
                {isLoggedIn && (
                    <div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
