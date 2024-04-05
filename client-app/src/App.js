import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route properly
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import ResetPasswordPage from './Components/ResetPasswordPage';
import DonatedItemsList from './Components/DonatedItemsList';
import StatusDisplayPage from './Components/StatusDisplayPage';
import ProgramsPage from './Components/ProgramsPage';
import AddProgramPage from './Components/AddProgramPage'; // Import AddProgramPage correctly

function App() {
  // Define handleAddProgram function here
  const handleAddProgram = (formData) => {
    // Logic to add program goes here
    console.log('Adding new program:', formData);
  };

  return (
    <div className="App">
      <Navbar />
      <Routes> {/* Use Routes component */}
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPasswordPage />} />
        <Route path="/item/:itemId" element={<StatusDisplayPage />} />
        <Route path="/donations" element={<DonatedItemsList />} /> {/* Corrected Route element */}
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/addprogram" element={<AddProgramPage />} />
        <Route path="/addprogram" element={<AddProgramPage onAddProgram={handleAddProgram} />} />

      </Routes>
    </div>
  );
}

export default App;
