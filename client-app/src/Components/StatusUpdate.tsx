import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ItemStatus from '../constants/Enums';
import '../css/DonorForm.css';

interface FormData {
    currentStatus: string;
    dateDonated: string;
}

interface FormErrors {
    [key: string]: string;
}

interface Option {
    value: string;
    label: string;
    id?: number;
}

const StatusUpdate: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        currentStatus: 'Line 25',  // Initial status
        dateDonated: '',
    });
    const { id } = useParams<{ id: string }>();
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const validateField = (name: string, value: any) => {
        if (!value || value.length === 0) {
            return `${name.replace(/([A-Z])/g, ' $1')} is required`;
        }
        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('currentStatus', formData.currentStatus);
                formDataToSubmit.append('dateDonated', formData.dateDonated);
    
                const response = await axios.put(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/status/${id}`,
                    formDataToSubmit,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
    
                if (response.status === 200) {
                    setSuccessMessage('Item updated successfully!');
                    handleRefresh();
                    navigate('/donations');
                } else {
                    setErrorMessage('Failed to update item');
                }
            } catch (error: any) {
                setErrorMessage(
                    error.response?.data?.message || 'Error updating item'
                );
            }
        } else {
            setErrorMessage('Form has validation errors');
        }
    };
    

    const handleRefresh = () => {
        setFormData({
            currentStatus: 'Received',
            dateDonated: '',
        });
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
        options?: Option[]
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            {options ? (
                <select
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    {/*<option value="">Select a status</option>*/}
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
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
                    className={`w-full px-3 py-2 rounded border ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
            )}
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="donor-form outer-container mx-auto p-10">
            <h1 className="text-2xl font-bold heading-centered">Update Donated Item</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="form-grid">
                {renderFormField('Current Status', 'currentStatus', 'text', true, [
                    { value: ItemStatus.DONATED, label: 'Donated' },
                    { value: ItemStatus.IN_STORAGE, label: 'In storage facility' },
                    { value: ItemStatus.REFURBISHED, label: 'Refurbished' },
                    { value: ItemStatus.SOLD, label: 'Item sold' },
                    { value: ItemStatus.RECEIVED, label: 'Received' },
                ])}
                {renderFormField('Date Updated', 'dateDonated', 'date')}

                <div className="form-field full-width button-container">
                    <button type="submit" className="submit-button">Update</button>
                    <button type="button" onClick={handleRefresh} className="refresh-button">Refresh</button>
                </div>
            </form>
        </div>
    );
};

export default StatusUpdate;