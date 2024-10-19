import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route properly
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import ResetPasswordPage from './Components/ResetPasswordPage';
import DonatedItemsList from './Components/DonatedItemsList';
import DonorForm from './Components/DonorForm.tsx';
import StatusDisplayPage from './Components/StatusDisplayPage';
import Programs from './Components/Programs';
import AddProgramPage from './Components/AddProgramPage'; // Import AddProgramPage correctly
import NewItemForm from './Components/NewItemForm.tsx';
import AddDonor from './Components/AddDonor'; // Why is this here?

function App() {
    // Define handleAddProgram function here
    const handleAddProgram = formData => {
        // Logic to add program goes here
        console.log('Adding new program:', formData);
    };

    return (
        <div className="App">
            <Navbar />
            <Routes>
                {' '}
                {/* Use Routes component */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<Home />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/resetpassword" element={<ResetPasswordPage />} />
                <Route path="/item/:itemId" element={<StatusDisplayPage />} />
                <Route path="/donorform" element={<DonorForm />} />
                <Route path="/donations" element={<DonatedItemsList />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/addprogram" element={<AddProgramPage />} />
                <Route path="/adddonation" element={<NewItemForm />} />
                <Route
                    path="/addprogram"
                    element={<AddProgramPage onAddProgram={handleAddProgram} />}
                />
            </Routes>
        </div>
    );
}

export default App;
