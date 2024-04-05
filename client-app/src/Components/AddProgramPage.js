import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/AddProgramPage.css';

function AddProgramPage({ onAddProgram }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        aimAndCause: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        // Validate form data if needed
        onAddProgram(formData);
    };

    const handleClear = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            aimAndCause: '',
        });
    };

    return (
        <div className="container">
            <h1>Add Program</h1>
            <form className="form">
                <div className="form-group">
                    <label className="label">Name:</label>
                    <input className="input" type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="label">Description:</label>
                    <input className="input" type="text" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="label">Start Date:</label>
                    <input className="input" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="label">Aim and Cause:</label>
                    <textarea className="textarea" name="aimAndCause" value={formData.aimAndCause} onChange={handleChange} />
                </div>
                <div className="button-group">
                    <button className="save-button" type="button" onClick={handleSave}>Save</button>
                    <button className="clear-button" type="button" onClick={handleClear}>Clear</button>
                </div>
            </form>
            {/* Link to navigate back to ProgramsPage */}
            <div className="back-button">
                <Link to="/programs">
                    <button>Back to Programs</button>
                </Link>
            </div>
        </div>
    );
}

export default AddProgramPage;
