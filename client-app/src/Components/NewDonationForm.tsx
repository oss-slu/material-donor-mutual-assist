import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

interface FormData {
    itemType: string;
    currentStatus: string;
    donorEmail: string;
    program: string;
    imageUpload: string;
    dateDonated: string;
}

interface FormErrors {
    [key: string]: string;
}

const DonorForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        itemType: '',
        currentStatus: '',
        donorEmail: '',
        program: '',
        imageUpload: '',
        dateDonated: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle input change for all fields
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' })); // Reset errors on change
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Generalized validation function to reduce code repetition
    const validateField = (name: string, value: string) => {
        const requiredFields = [
            'itemType',
            'currentStatus',
            'donorEmail',
            'program',
            'imageUpload',
            'dateDonated',
        ];

        if (requiredFields.includes(name) && !value.trim()) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`; // Add spaces to camelCase names
        }
        if (name === 'donorEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
        }
        return '';
    };

    // Validation for entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                    formData,
                );
                if (response.status === 201) {
                    setSuccessMessage('Donor added successfully!');
                    setFormData({
                        itemType: '',
                        currentStatus: '',
                        donorEmail: '',
                        program: '',
                        imageUpload: '',
                        dateDonated: '',
                    });
                } else {
                    setErrorMessage('Donor not added');
                }
            } catch (error: unknown) {
                const message =
                    (error as any).response?.data?.message ||
                    'Error adding donor';
                setErrorMessage(message);
            }
        } else {
            setErrorMessage('Form has validation errors');
        }
    };

    // Handle form reset
    const handleRefresh = () => {
        setFormData({
            itemType: '',
            currentStatus: '',
            donorEmail: '',
            program: '',
            imageUpload: '',
            dateDonated: '',
        });
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Reusable function to render form fields (text and checkbox)
    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name] as string}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                Add Donor Details
            </h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="form-grid">
                {renderFormField('Item Type', 'itemType')}
                {renderFormField('Current Status', 'currentStatus')}
                {renderFormField('Donor Email', 'donorEmail')}
                {renderFormField('Program', 'program', 'program')}
                {renderFormField('Image Upload', 'imageUpload')}
                {renderFormField('Date Donated', 'dateDonated')}


                <div className="form-field full-width button-container">
                    <button type="submit" className="submit-button">
                        Add Donor
                    </button>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="refresh-button"
                    >
                        Refresh
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DonorForm;
