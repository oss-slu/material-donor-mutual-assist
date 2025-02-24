import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/LoginPage.css'; // Import CSS file for styling
import { usePopup } from './LoginPopup';

interface Credentials {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState<string>('');
    const [captchaValue, setCaptchaValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPopup, setShowPopup] = useState(false);
    const { triggerPopup } = usePopup();

    const generateCaptcha = (): void => {
        //const randomCaptcha = Math.random().toString(36).substring(7);
        const randomCaptcha = '1';
        setCaptcha(randomCaptcha);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCaptchaChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCaptchaValue(e.target.value);
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        // Validate CAPTCHA
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
                //alert('Login Successful');
                // setShowPopup(true);
                // setTimeout(() => {
                //     setShowPopup(false);
                // }, 5000);
                triggerPopup('Login success!');
                console.log('Hello');
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
            {showPopup && (
                <div className="popup">✅ Login Successful! Redirecting...</div>
            )}
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
        </div>
    );
};

export default LoginPage;
