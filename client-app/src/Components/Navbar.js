import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  
  const [user, setUser] = useState('');
  
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    
    if (token && name) {
      setIsLoggedIn(true);
      setUser(name);

    }
    console.log("in navbar useEffect ")
    if(localStorage.getItem('isLogged') === 'true')
      {
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false)
      }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser('');
    localStorage.setItem('isLogged', false);
    setIsLoggedIn(false); // Update state with the new value
  
    window.location.href = "/";
  }
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><img src="/bworks.png" alt="Logo" style={{ width: '100px', height: '50px' }} /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <span>Welcome {user}!</span>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link
                    className="nav-link"
                    to="/donations"
                    style={{
                      fontWeight: location.pathname === '/donations' ? 'bold' : 'normal',
                      color: location.pathname === '/donations' ? 'black' : 'inherit'
                    }}
                  >Donations</Link>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link
                    className="nav-link"
                    to="/programs"
                    style={{
                      fontWeight: location.pathname === '/programs' ? 'bold' : 'normal',
                      color: location.pathname === '/programs' ? 'black' : 'inherit'
                    }}
                  >Programs</Link>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link
                    className="nav-link"
                    to="/donorform"
                    style={{
                      fontWeight: location.pathname === '/donorform' ? 'bold' : 'normal',
                      color: location.pathname === '/donorform' ? 'black' : 'inherit'
                    }}
                  >Donor Form</Link>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link
                    className="nav-link"
                    to="/about"
                    style={{
                      fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                      color: location.pathname === '/about' ? 'black' : 'inherit'
                    }}
                  >About</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link className="nav-link active" to="/login"
                    style={{
                      fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
                      color: location.pathname === '/login' ? 'black' : 'inherit'
                    }}
                  >Login</Link>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link className="nav-link active" to="/register"
                    style={{
                      fontWeight: location.pathname === '/register' ? 'bold' : 'normal',
                      color: location.pathname === '/register' ? 'black' : 'inherit'
                    }}
                  >Register</Link>
                </li>
                <li className="nav-item" style={{ fontSize: "20px", paddingLeft: "10px" }}>
                  <Link
                    className="nav-link"
                    to="/about"
                    style={{
                      fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                      color: location.pathname === '/about' ? 'black' : 'inherit'
                    }}
                  >About</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {isLoggedIn && (
          <div>
            <button onClick={ handleLogout }>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
