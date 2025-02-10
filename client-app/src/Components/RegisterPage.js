import React, { useState } from 'react';
import '../css/RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        password: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        zipcode: '',
        emailOptIn: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="register-container">
            <h2>Donor Tracking System</h2>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact Number (10 digits)"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <small>
                        Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="addressLine1"
                        placeholder="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="addressLine2"
                        placeholder="Address Line 2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="ZIP Code (5 digits)"
                        value={formData.zipcode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="emailOptIn"
                            checked={formData.emailOptIn}
                            onChange={handleChange}
                        />
                        I agree to receive emails
                    </label>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;