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
        { value: 'Bicycle', label: 'Bicycle' },
        { value: 'Computer', label: 'Computer' },
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
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}/donor`,
                );
                const emailOptions = response.data.map((donor: any) => ({
                    value: donor.firstName,
                    label: donor.email,
                    id: donor.id,
                }));

                setDonorEmailOptions(emailOptions);
                console.log('Donor Options:', emailOptions);
            } catch (error) {}
        };

        const fetchPrograms = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}/program`,
                );
                console.log('Programs:', response.data);
                const programOptions = response.data.map((program: any) => ({
                    value: program.name,
                    label: program.name,
                    id: program.id,
                }));
                console.log('Program Options:', programOptions);
                setProgramOptions(programOptions);
            } catch (error) {
                console.error('Error fetching program', error);
            }
        };

        fetchDonorEmails();
        fetchPrograms();
    }, []);

    // Convert image files to base64 for preview and submission
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };
    // Handle image file change
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

    // Remove image from preview and form data
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

    // Handle input changes, including image uploads
    const handleChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, type, value, files } = e.target as HTMLInputElement;

        if (name === 'imageUpload' && files) {
            const fileArray = Array.from(files);
            const base64Images = await Promise.all(
                fileArray.map(file => convertToBase64(file)),
            );
            setFormData(prevState => ({
                ...prevState,
                [name]: base64Images,
            }));
        } else {
            // For dropdowns, we store the donor and program ID
            if (name === 'itemType') {
                const selectedType = itemTypeOptions.find(
                    option => option.value === value,
                );
                setFormData(prevState => ({
                    ...prevState,
                    itemType: value,
                }));
            }
            if (name === 'donorEmail') {
                const selectedDonor = donorEmailOptions.find(
                    option => option.value === value,
                );
                setFormData(prevState => ({
                    ...prevState,
                    donorEmail: value,
                    donorId: selectedDonor?.id || null, // Store donor ID
                }));
            } else if (name === 'program') {
                const selectedProgram = programOptions.find(
                    option => option.value === value,
                );
                setFormData(prevState => ({
                    ...prevState,
                    program: value,
                    programId: selectedProgram?.id || null, // Store program ID
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Validation for individual fields
    const validateField = (name: string, value: any) => {
        const requiredFields = [
            'itemType',
            'currentStatus',
            'donorEmail',
            'program',
            'dateDonated',
        ];
        if (requiredFields.includes(name)) {
            if (!value || value.length === 0) {
                return `${name.replace(/([A-Z])/g, ' $1')} is required`;
            }
        }
        return '';
    };

    // Validate the entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // In form submission, you should now submit donorId and programId
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSubmit = new FormData();
                console.log('formData:', formData);
                formDataToSubmit.append('itemType', formData.itemType);
                formDataToSubmit.append(
                    'currentStatus',
                    formData.currentStatus,
                );
                formDataToSubmit.append(
                    'donorId',
                    formData.donorId !== null ? String(formData.donorId) : '',
                ); // Ensure donorId is a number
                formDataToSubmit.append(
                    'programId',
                    String(Number(formData.programId)),
                ); // Ensure programId is a number

                formDataToSubmit.append('dateDonated', formData.dateDonated);

                console.log('formDataToSubmit:', formDataToSubmit);
                console.log(
                    'formDataToSubmit:',
                    Array.from(formDataToSubmit.entries()),
                );

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}/donatedItem`,
                    formDataToSubmit,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (response.status === 201) {
                    setSuccessMessage('Item added successfully!');
                    setFormData({
                        itemType: '',
                        currentStatus: 'Riceived',
                        donorEmail: '',
                        donorId: null,
                        program: '',
                        programId: null,
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
            currentStatus: '',
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

    // Reusable function to render form fields
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
            {type === 'file' ? (
                <>
                    <input
                        type="file"
                        id={name}
                        name={name}
                        onChange={handleChange}
                        multiple
                        accept="image/*"
                        className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                        title="Upload 1-5 images in JPG or PNG format"
                    />
                    <div className="image-preview">
                        {previews.map((preview, index) => (
                            <div key={index} className="preview-container">
                                <img
                                    src={preview}
                                    alt={`preview-${index}`}
                                    width="100"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="remove-image-button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : options ? (
                <select
                    id={name}
                    name={name}
                    value={formData[name] ?? ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
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
            <form className="form-container" onSubmit={handleSubmit}>
                {renderFormField(
                    'Item Type',
                    'itemType',
                    'text',
                    true,
                    itemTypeOptions,
                )}
                {''}
                <p>Current Status</p>
                <input
                    style={{ color: 'black' }}
                    type="text"
                    name="currentStatus"
                    value={formData.currentStatus}
                    disabled // This makes the field uneditable
                    onChange={handleChange} // Keep this if you want to ensure form data sync
                />

                {/* Read-only */}
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
                {/* {renderFormField(
                    'Images (Max 5)',
                    'imageUpload',
                    'file',
                    false,
                )} */}
                <div className="form-field">
                    <label htmlFor="imageUpload">Upload Images (Max 5):</label>
                    <input
                        type="file"
                        name="imageUpload"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                    />
                    <div className="image-preview-container">
                        {previews.map((preview, index) => (
                            <div key={index} className="preview-item">
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
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
                <div className="form-actions flex justify-between">
                    <button type="submit" className="primary-button">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleRefresh}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewItemForm;
