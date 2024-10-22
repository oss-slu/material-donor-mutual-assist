import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

interface FormData {
    itemType: string;
    currentStatus: string;
    donorEmail: string;
    donorId: number | null;
    program: string;
    programId: number | null;
    imageUpload: string[];
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

const NewItemForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        itemType: '',
        currentStatus: 'Received',
        donorEmail: '',
        donorId: null,
        program: '',
        programId: null,
        imageUpload: [],
        dateDonated: '',
    });

    const itemTypeOptions: Option[] = [
        { value: 'bicycle', label: 'Bicycle' },
        { value: 'computer', label: 'Computer' },
    ];

    const [donorEmailOptions, setDonorEmailOptions] = useState<Option[]>([]);
    const [programOptions, setProgramOptions] = useState<Option[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonorEmails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                );
                const emailOptions = response.data.map((donor: any) => ({
                    value: donor.firstName,
                    label: donor.email,
                    id: donor.id,
                }));
                setDonorEmailOptions(emailOptions);
            } catch (error) {
                console.error('Error fetching donor emails:', error);
            }
        };

        const fetchPrograms = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
                );
                const programOptions = response.data.map((program: any) => ({
                    value: program.name,
                    label: program.name,
                    id: program.id,
                }));
                setProgramOptions(programOptions);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchDonorEmails();
        fetchPrograms();
    }, []);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const base64Images = await Promise.all(
                fileArray.map(file => convertToBase64(file)),
            );
            setFormData(prevState => ({
                ...prevState,
                imageUpload: [...prevState.imageUpload, ...base64Images],
            }));
            setPreviews([...previews, ...base64Images]);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = formData.imageUpload.filter(
            (_, i) => i !== index,
        );
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            imageUpload: updatedImages,
        }));
        setPreviews(updatedPreviews);
    };

    const handleChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        if (name === 'itemType') {
            setFormData(prevState => ({
                ...prevState,
                itemType: value,
            }));
        } else if (name === 'donorEmail') {
            const selectedDonor = donorEmailOptions.find(
                option => option.value === value,
            );
            setFormData(prevState => ({
                ...prevState,
                donorEmail: value,
                donorId: selectedDonor?.id || null,
            }));
        } else if (name === 'program') {
            const selectedProgram = programOptions.find(
                option => option.value === value,
            );
            setFormData(prevState => ({
                ...prevState,
                program: value,
                programId: selectedProgram?.id || null,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const validateField = (name: string, value: any) => {
        const requiredFields = [
            'itemType',
            'currentStatus',
            'donorEmail',
            'program',
            'dateDonated',
        ];

        if (requiredFields.includes(name) && (!value || value.length === 0)) {
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
                formDataToSubmit.append('itemType', formData.itemType);
                formDataToSubmit.append(
                    'currentStatus',
                    formData.currentStatus,
                );
                formDataToSubmit.append(
                    'donorId',
                    formData.donorId !== null ? String(formData.donorId) : '',
                );
                formDataToSubmit.append(
                    'programId',
                    String(Number(formData.programId)),
                );
                formDataToSubmit.append('dateDonated', formData.dateDonated);

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem`,
                    formDataToSubmit,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (response.status === 201) {
                    setSuccessMessage('Item added successfully!');
                    handleRefresh();
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

    const handleRefresh = () => {
        setFormData({
            itemType: '',
            currentStatus: 'Received',
            donorEmail: '',
            donorId: null,
            program: '',
            programId: null,
            imageUpload: [],
            dateDonated: '',
        });
        setPreviews([]);
        setErrors({});
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const renderFormField = (
        label: string,
        name: keyof FormData,
        type = 'text',
        required = true,
        options?: Option[],
    ) => (
        <div className="form-field">
            <label htmlFor={name} className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500">&nbsp;*</span>}
            </label>
            {name === 'imageUpload' ? (
                <div>
                    <input
                        type="file"
                        id={name}
                        name={name}
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className={`w-full px-3 py-2 rounded border ${
                            errors[name] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        title="Upload 1-5 images in JPG or PNG format"
                    />
                    <div className="image-preview-grid mt-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="preview-item relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="remove-image-button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : options ? (
                <select
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${
                        errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select {label}</option>
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
                    disabled={name === 'currentStatus'}
                />
            )}
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
        </div>
    );

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
                {renderFormField(
                    'Item Type',
                    'itemType',
                    'text',
                    true,
                    itemTypeOptions,
                )}
                {renderFormField('Current Status', 'currentStatus')}
                {renderFormField(
                    'Donor Email',
                    'donorEmail',
                    'text',
                    true,
                    donorEmailOptions,
                )}
                {renderFormField(
                    'Program',
                    'program',
                    'text',
                    true,
                    programOptions,
                )}
                {renderFormField('Date Donated', 'dateDonated', 'date')}
                {renderFormField(
                    'Images (Max 5)',
                    'imageUpload',
                    'file',
                    false,
                )}

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

export default NewItemForm;
