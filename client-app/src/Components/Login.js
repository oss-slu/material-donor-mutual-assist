import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css'; // Import the CSS file

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [captcha, setCaptcha] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const generateCaptcha = () => {
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
    };

    const handleSubmit = e => {
        e.preventDefault();

        // Validate CAPTCHA
        if (captchaValue.toLowerCase() !== captcha.toLowerCase()) {
            setErrorMessage('Incorrect CAPTCHA. Please try again.');
            return;
        }

        // If successful, update local storage and redirect
        localStorage.setItem('isLogged', true);
        window.location.href = '/Donations';

        console.log('Login successful:', localStorage.getItem('isLogged'));
    };

    const onChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleCaptchaChange = e => {
        setCaptchaValue(e.target.value);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        value={credentials.email}
                        onChange={onChange}
                    />
                    <small className="form-text">
                        We'll never share your email with anyone else.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        value={credentials.password}
                        onChange={onChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="captcha" className="form-label">
                        CAPTCHA: {captcha}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="captcha"
                        id="captcha"
                        value={captchaValue}
                        onChange={handleCaptchaChange}
                    />
                </div>

                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!captchaValue}
                >
                    Submit
                </button>

                <Link to="/forgot-password" className="btn btn-link">
                    Forgot Password?
                </Link>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={generateCaptcha}
                >
                    Refresh CAPTCHA
                </button>
            </form>
        </div>
    );
};

export default Login;
