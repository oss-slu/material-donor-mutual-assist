import React, { useState } from "react";
import axios from "axios";
import "../css/DonorForm.css";

const DonorForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    zipcode: "",
    emailOptIn: false, // Changed to boolean to match schema
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    const handleRefresh = async () => {
      setFormData({ ...formData }); // Reset to default
    };
    handleRefresh();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = "Zip Code is required";
    } else if (!/^\d{5}$/.test(formData.zipcode)) {
      newErrors.zipcode = "Invalid zip code format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/donor",
          formData
        );
        if (response.status === 201) {
          setSuccessMessage("Donor added successfully!");
          setFormData({
            firstName: "",
            lastName: "",
            contact: "",
            email: "",
            addressLine1: "",
            addressLine2: "",
            state: "",
            city: "",
            zipcode: "",
            emailOptIn: false,
          });
        } else {
          setErrorMessage("Donor not added");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error adding donor");
      }
    } else {
      setErrorMessage("Form has validation errors");
    }
  };

  return (
    <div className="outer-container mx-auto p-4">
      <div className="donor-form">
        <h1 className="text-2xl font-bold mb-4">Add Donor Details</h1>
        {errorMessage && (
          <p
            className="block text-sm font-semibold mb-1"
            style={{ backgroundColor: "red" }}
          >
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p
            className="block text-sm font-semibold mb-1"
            style={{ backgroundColor: "green" }}
          >
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Form fields dynamically generated based on formData */}
          {Object.keys(formData).map((key) =>
            key === "emailOptIn" ? (
              <div key={key} className="mb-4">
                <label>
                  Email Opt-in:
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={handleChange}
                  />
                </label>
              </div>
            ) : (
              <div key={key} className="mb-4">
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold mb-1"
                >
                  {key.charAt(0).toUpperCase() +
                    key
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  :
                </label>
                <input
                  type={key.includes("email") ? "email" : "text"}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded border ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                )}
              </div>
            )
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
          >
            Add Donor
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorForm;
