import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/LoginPage.css'; // Import CSS file for styling

const LoginPage = props => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const generateCaptcha = () => {
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
    };

    const onChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleCaptchaChange = e => {
        setCaptchaValue(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // Retrieve user data from local storage
        // const storedUser = localStorage.getItem('user');
        if (captchaValue.toLowerCase() !== captcha.toLowerCase()) {
            setErrorMessage('Incorrect CAPTCHA. Please try again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login Successful');
                window.location.href = '/Donations';
            } else {
                setErrorMessage(data.message || 'Invalid email or password.');
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            {/* <form onSubmit={handleSubmit}> */}

            <div className="login-container">
                <h2 className="login-label">Login</h2>
                <div className="login-box">
                    <div className="bg-#a9d6e5 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {errorMessage && (
                            <p style={{ color: 'red' }}>{errorMessage}</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="email"
                                    className="istyleu"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={credentials.email}
                                    onChange={onChange}
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone
                                    else.
                                </div>
                            </div>

                            <div>
                                <input
                                    type="password"
                                    className="istyle"
                                    value={credentials.password}
                                    placeholder="Password*"
                                    id="password"
                                    onChange={onChange}
                                    name="password"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="captcha" className="captha">
                                    CAPTCHA: {captcha}
                                </label>
                                <input
                                    type="text"
                                    className="istyle"
                                    value={captchaValue}
                                    onChange={handleCaptchaChange}
                                    id="captcha"
                                    name="captcha"
                                />
                            </div>

                            <div className="buttongroups">
                                <button
                                    className="btlSuccess"
                                    type="submit"
                                    // onClick={handleLogin}
                                    name="login"
                                    disabled={!captchaValue}
                                >
                                    Login
                                </button>
                                <Link
                                    to="/forgot-password"
                                    className="btn btn-link"
                                >
                                    Forgot Password?
                                </Link>{' '}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={generateCaptcha}
                                >
                                    Refresh CAPTCHA
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="register-link">
                        <p>
                            Not a User? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* </form> */}
        </div>
    );
};

export default LoginPage;
