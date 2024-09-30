import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

interface FormData {
    itemType: string;
    currentStatus: string;
    donorEmail: string;
    program: string;
    imageUpload: string[];
    dateDonated: string;
}

interface FormErrors {
    [key: string]: string;
}

const DonorForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        itemType: '',
        currentStatus: 'Received',
        donorEmail: '',
        program: '',
        imageUpload: [],
        dateDonated: '',
    });

    const itemTypeOptions = [
        {value: 'bicycle', label: 'Bicycle'},
        {value: 'computer', label: 'Computer'},
    ]

    const donorEmailOptions = [
        {value: 'email1', label: 'cooldude@gmail.com'},
        {value: 'email2', label: 'cplusplushater@icloud.com'},
        {value: 'email3', label: 'ISEBestBuilding@yahoo.com'},
    ]

    const programOptions = [
        {value: 'youthProgram', label: 'Youth Program'},
        {value: 'retailSales', label: 'Retail Sales'},
        {value: 'recycle', label: 'Recycle'},
        {value: 'earnABicycle', label: 'Earn-a-bicycle'},
        {value: 'earnAComputer', label: 'Earn-a-computer'},
    ]

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle input change for all fields
    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, type, value, files} = e.target as HTMLInputElement;

        if (name === 'imageUpload' && files) {
            const fileArray = Array.from(files);
            const base64Images = await Promise.all(fileArray.map(file=>convertToBase64(file)));
            setFormData(prevState => ({
                ...prevState,
                [name]: base64Images,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name] : value,
            }));
        }
        setErrors(prevState => ({ ...prevState, [name]: '' })); // Reset errors on change
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Generalized validation function to reduce code repetition
    const validateField = (name: string, value: any) => {
        const requiredFields = [
            'itemType',
            'currentStatus',
            'donorEmail',
            'program',
            'imageUpload',
            'dateDonated',
        ];

        if (requiredFields.includes(name)) {
            if (name === 'itemType') {
                if (!value || value.length === 0) {
                    return "Please select an item type"
                }
            } else if (name === 'currentStatus') {
                if (!value || value.length === 0) {
                    return "Please enter a status"
                }
            } else if (name === 'donorEmail') {
                if (!value || value.length === 0) {
                    return "Please select the donor's email"
                }
            } else if (name === 'program') {
                if (!value || value.length === 0) {
                    return "Please select a program"
                }
            } else if (name === 'imageUpload') {
                if (!value || value.length === 0) {
                    return 'Please upload at least one image';
                } else if (value.length > 5) {
                    return 'Please keep under 5 images'
                }
            } else if (name === 'dateDonated') {
                if (!value || value.length === 0) {
                    return 'Please select a date'
                }
            } else if (typeof value === 'string' && !value.trim()) {
                return `${name.replace(/([A-Z])/g, ' $1')} is required`;
            }
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
                    setSuccessMessage('Item added successfully!');
                    console.log('Item Type: ' + formData.itemType);
                    console.log('Current Status ' + formData.currentStatus);
                    console.log('Donor Email: ' + formData.donorEmail);
                    console.log('Program: ' + formData.program);
                    console.log('Image Upload: ' + formData.imageUpload);
                    console.log('Date Donated: ' + formData.dateDonated);
                    setFormData({
                        itemType: '',
                        currentStatus: 'Received',
                        donorEmail: '',
                        program: '',
                        imageUpload: [],
                        dateDonated: '',
                    });
                } else {
                    setErrorMessage('Item not added');
                }
            } catch (error: unknown) {
                const message =
                    (error as any).response?.data?.message ||
                    'Error adding item';
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
            currentStatus: 'Received',
            donorEmail: '',
            program: '',
            imageUpload: [],
            dateDonated: '',
        });
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Reusable function to render form fields (text, dropdown, date, file upload, and checkbox)
    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
        options?: {value: string; label: string}[], 
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            {type === 'file' ? (
                <input
                    type = "file"
                    id = {name}
                    name = {name}
                    onChange = {handleChange}
                    multiple
                    accept = "image/*"
                    className = {`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                    title = "Upload 1-5 images in JPG or PNG format"         
                />
            ) : options ? ( // Only executes if there are options available
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            >
            <option value = "">Select {label}</option>
            {options?.map(option => (
                    <option key = {option.value} value = {option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name] as string}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                disabled = {name === 'currentStatus'}
            />
        )}
        {errors[name] && (
            <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
        </div>
    );

    // HTML portion
    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">
                New Donated Item
            </h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="form-grid">
                {renderFormField('Item Type', 'itemType', 'text', true, itemTypeOptions)}
                {renderFormField('Current Status', 'currentStatus')}
                {renderFormField('Donor Email', 'donorEmail', 'text', true, donorEmailOptions)}
                {renderFormField('Program', 'program', 'text', true, programOptions)}
                {renderFormField('Image Upload', 'imageUpload', 'file')}
                {renderFormField('Date Donated', 'dateDonated', 'date')}


                <div className="form-field full-width button-container">
                    <button type="submit" className="submit-button">
                        Add Item
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

// NOTE: I will be moving my code to NewDonationForm.tsx as soon as I can get a tab for it. This is so I could see what I was working on

/*import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

interface FormData {
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    city: string;
    zipcode: string;
    emailOptIn: boolean;
}

interface FormErrors {
    [key: string]: string;
}

const DonorForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        zipcode: '',
        emailOptIn: false,
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
            'firstName',
            'lastName',
            'contact',
            'email',
            'addressLine1',
            'state',
            'city',
            'zipcode',
        ];

        if (requiredFields.includes(name) && !value.trim()) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`; // Add spaces to camelCase names
        }
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
        } else if (name === 'contact' && value && !/^[0-9]{10}$/.test(value)) {
            return 'Contact must be a 10-digit number';
        } else if (name === 'zipcode' && !/^\d{5}$/.test(value)) {
            return 'Invalid zip code format';
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
                        firstName: '',
                        lastName: '',
                        contact: '',
                        email: '',
                        addressLine1: '',
                        addressLine2: '',
                        state: '',
                        city: '',
                        zipcode: '',
                        emailOptIn: false,
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
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            city: '',
            zipcode: '',
            emailOptIn: false,
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
                {renderFormField('First Name', 'firstName')}
                {renderFormField('Last Name', 'lastName')}
                {renderFormField('Contact', 'contact')}
                {renderFormField('Email', 'email', 'email')}
                {renderFormField('Address Line 1', 'addressLine1')}
                {renderFormField(
                    'Address Line 2',
                    'addressLine2',
                    'text',
                    false,
                )}
                {renderFormField('State', 'state')}
                {renderFormField('City', 'city')}
                {renderFormField('Zip Code', 'zipcode')}*/

                //{/* Email Opt-In Field */}
                /*<div className="form-field">
                    <label
                        htmlFor="emailOptIn"
                        className="block text-sm font-semibold mb-1"
                    >
                        Email Opt-in
                    </label>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="emailOptIn"
                            name="emailOptIn"
                            checked={formData.emailOptIn}
                            onChange={handleChange}
                        />
                        <span className="checkbox-message">
                            {' '}
                            Stay updated with donation progress
                        </span>
                    </div>
                </div>

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

export default DonorForm;*/
