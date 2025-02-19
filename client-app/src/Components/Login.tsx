import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Credentials {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: '',
    });
    const [captcha, setCaptcha] = useState<string>('');
    const [captchaValue, setCaptchaValue] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPopup, setShowPopup] = useState(false);

    localStorage.setItem('isLogged', 'false');

    const generateCaptcha = (): void => {
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // Validate CAPTCHA
        if (captchaValue.toLowerCase() !== captcha.toLowerCase()) {
            setErrorMessage('Incorrect CAPTCHA. Please try again.');
            return;
        }

        // Simulated login success
        localStorage.setItem('isLogged', 'true');
        window.location.href = '/Donations';
        setShowPopup(true);
        //alert('Login Success');
        //setShowPopup(true);

        // Hide the pop-up after 3 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 5000);

        console.log('in login page ', localStorage.getItem('isLogged'));
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCaptchaChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCaptchaValue(e.target.value);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="my-5 container">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={onChange}
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={onChange}
                        name="password"
                        id="password"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="captcha" className="form-label">
                        CAPTCHA: {captcha}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={captchaValue}
                        onChange={handleCaptchaChange}
                        id="captcha"
                        name="captcha"
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
                </Link>{' '}
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
