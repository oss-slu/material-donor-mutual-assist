import React, { useState } from 'react';
import '../css/RegisterPage.css';

const Register = () => {
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [passwordStrength, setPasswordStrength] = useState('weak');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });

        // Determine password strength
        if (value.length < 12) {
            setPasswordStrength('weak');
        } else if (value.length >= 12 && value.length <= 15) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('strong');
        }

        // Validate password length
        if (value.length < 12) {
            setErrorMessage('Password must be at least 12 characters');
            return;
        }

        // Check for username or email
        if (value.match(credentials.name)) {
            setErrorMessage('Password must not contain name');
            return;
        }

        if (value.match(credentials.email)) {
            setErrorMessage('Password must not contain email');
            return;
        }

        // Check Password Rules
        const missing = [];

        if (!value.match(/[A-Z]/)) {
            missing.push('an uppercase');
        }

        if (!value.match(/[a-z]/)) {
            missing.push('a lowercase');
        }

        if (!value.match(/[0-9]/)) {
            missing.push('a number');
        }

        if (!value.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
            missing.push('a special character');
        }

        if (missing.length !== 0) {
            if (missing.length === 1) {
                setErrorMessage('Password must contain ' + missing[0] + '!');
                return;
            }
            const tmp = missing.pop();
            setErrorMessage(
                'Password must contain ' +
                    missing.join(', ') +
                    ' and ' +
                    tmp +
                    '!',
            );
            return;
        } else {
            setErrorMessage('');
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // Check if passwords match
        if (credentials.password !== credentials.confirm_password) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Validate password length
        if (credentials.password.length < 12) {
            setErrorMessage('Password must be at least 12 characters');
            return;
        }

        // Check for username or email
        if (credentials.password.match(credentials.name)) {
            setErrorMessage('Password must not contain name');
            return;
        }

        if (credentials.password.match(credentials.email)) {
            setErrorMessage('Password must not contain email');
            return;
        }

        // Check Password Rules
        const missing = [];

        if (!credentials.password.match(/[A-Z]/)) {
            missing.push('an uppercase');
        }

        if (!credentials.password.match(/[a-z]/)) {
            missing.push('a lowercase');
        }

        if (!credentials.password.match(/[0-9]/)) {
            missing.push('a number');
        }

        if (!credentials.password.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
            missing.push('a special character');
        }

        if (missing.length !== 0) {
            if (missing.length === 1) {
                setErrorMessage('Password must contain ' + missing[0] + '!');
                return;
            }
            const tmp = missing.pop();
            setErrorMessage(
                'Password must contain ' +
                    missing.join(', ') +
                    ' and ' +
                    tmp +
                    '!',
            );
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}api/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: credentials.name,
                        email: credentials.email,
                        password: credentials.password, // Send only password (confirm_password removed)
                    }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
                setCredentials({
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                });

                setTimeout(() => {
                    window.location.href = '/About'; // Redirect after success
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="rlogin-container">
                <h2 className="rhead">Register</h2>
                <div className="rlogin-box">
                    <div className="bg-#a9d6e5 ">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="rlabelu">Name</label>
                                <input
                                    type="text"
                                    className="ristyle"
                                    value={credentials.name}
                                    onChange={e =>
                                        setCredentials({
                                            ...credentials,
                                            name: e.target.value,
                                        })
                                    }
                                    id="name"
                                    name="name"
                                    aria-describedby="emailHelp"
                                />
                            </div>
                            <div>
                                <label className="rlabelu">Email address</label>
                                <input
                                    type="email"
                                    className="ristyle"
                                    value={credentials.email}
                                    onChange={e =>
                                        setCredentials({
                                            ...credentials,
                                            email: e.target.value,
                                        })
                                    }
                                    id="email"
                                    name="email"
                                    aria-describedby="emailHelp"
                                />
                            </div>
                            <div>
                                <label className="rlabelu">Password</label>
                                <input
                                    type="password"
                                    className="ristyle"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    name="password"
                                    id="password"
                                />
                                <div
                                    className="password-strength-meter"
                                    style={{ display: 'flex' }}
                                >
                                    <p className="my-3">Password Strength:</p>{' '}
                                    <p
                                        className={`text-${passwordStrength} my-3 mx-2`}
                                        style={{
                                            marginTop: '5px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {passwordStrength.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-3 position-relative">
                                <label
                                    htmlFor="confirm_password"
                                    className="rlabelu"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="ristyle"
                                    value={credentials.confirm_password}
                                    onChange={handleChange}
                                    name="confirm_password"
                                    id="confirm_password"
                                />
                            </div>
                            {errorMessage && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >
                                    {successMessage}
                                </div>
                            )}
                            <button type="submit" className="rbtSuccess">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
