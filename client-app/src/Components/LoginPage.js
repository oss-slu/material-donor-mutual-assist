import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/LoginPage.css'; // Import CSS file for styling

const LoginPage = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUser({ ...user, username: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setUser({ ...user, password: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Verify username and password
      if (user.username === parsedUser.username && user.password === parsedUser.password) {
        alert('Login successful');
      } else {
        alert('Invalid username or password');
      }
    } else {
      alert('User not found');
    }
  };

  const handleLogin = () => {
    // Store user data in local storage
    const userDetails = { username: 'user', password: 'dts@123' };
    localStorage.setItem('user', JSON.stringify(userDetails));
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="login-container">
        <div className="login-header">
          <h1>Donor Tracking System</h1>
        </div>
        <div className="login-box">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="login-label">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  className="input-style"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="mb-6">
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-style"
                    value={user.password}
                    placeholder='Password*'
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between btn-container">
                <button
                  className="btn-success"
                  type="submit"
                  onClick={handleLogin}
                  name="login"
                >
                  Login
                </button>
                <button
                  className="btn-style button-gap"
                  type="button"
                >
                  Forgot Password
                </button>
              </div>
            </form>
          </div>
          <div className="register-link">
            <p>Not a User? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
