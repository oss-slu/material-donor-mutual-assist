import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const email = location.state && location.state.email;

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (credentials.password !== credentials.confirm_password) {
                setError('Passwords do not match');
                return;
            }

            // Validate password length
            if (credentials.password.length < 12) {
                setError('Password must be at least 12 characters');
                return;
            }

            //Check Password Rules
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

            if (!credentials.password.match(/[^\\w\\s]/)) {
                missing.push('a special character');
            }

            if (missing.length !== 0) {
                if (missing.length === 1) {
                    setError('Password must contain ' + missing[0] + '!');
                    return;
                }
                const tmp = missing.pop();
                setError(
                    'Password must contain ' +
                        missing.join(', ') +
                        ' and ' +
                        tmp +
                        '!',
                );
                return;
            }

            const response = await fetch(
                'http://localhost:5000/api/auth/resetpassword',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            const data = await response.json();
            setMessage(data.message);
            setTimeout(() => {
                navigate('/login');
                setMessage(''); // Clear the success message after navigating
            }, 3000); // Wait for 3 seconds before redirecting
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Error resetting password. Please try again.');
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && (
                    <div className="alert alert-success">{message}</div>
                )}
                <button type="submit" className="btn btn-primary">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
