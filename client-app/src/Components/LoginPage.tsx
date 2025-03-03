import React, {
    useState,
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
} from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/LoginPage.css'; // Import CSS file for styling
import Popup from './LoginPopup';

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
    const captchaCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { usePopup } = Popup;
    const { triggerPopup } = usePopup();

    useEffect(() => {
        generateCaptcha(); // Generate CAPTCHA on first load
    }, []);

    const generateCaptcha = (): void => {
        const randomCaptcha = Math.random().toString(36).substring(7);
        setCaptcha(randomCaptcha);
        drawCaptcha(randomCaptcha);
    };

    const drawCaptcha = (text: string): void => {
        if (captchaCanvasRef.current) {
            const canvas = captchaCanvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '20px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(text, 20, 25);
            }
        }
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
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}api/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                },
            );

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                triggerPopup('Welcome ' + data.name + '!');
                window.location.href = '/';
            } else {
                setErrorMessage(data.message || 'Invalid email or password.');
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
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
                                    CAPTCHA:
                                </label>
                                <canvas
                                    ref={captchaCanvasRef}
                                    width="100"
                                    height="30"
                                ></canvas>
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
