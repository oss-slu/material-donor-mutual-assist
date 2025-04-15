import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route properly
import Navbar from './Components/Navbar';

import LoginPage from './Components/LoginPage';
import Popup from './Components/LoginPopup.tsx';
import Register from './Components/Register';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword.tsx';
import ResetPasswordPage from './Components/ResetPasswordPage.tsx';
import DonatedItemsList from './Components/DonatedItemsList';
import DonorForm from './Components/DonorForm.tsx';
import StatusUpdate from './Components/AddNewStatus';
import Programs from './Components/Programs';
import AddProgramPage from './Components/AddProgramPage'; // Import AddProgramPage correctly
import EditProgramPage from './Components/EditProgramPage';
import NewItemForm from './Components/NewItemForm.tsx';
import DonorList from './Components/DonorList.tsx';
import DonatedItemDetails from './Components/DonatedItemDetails';
import DonorEdit from './Components/DonorEdit.tsx';
import AddDonor from './Components/AddDonor'; // Why is this here?
import DonorProfile from 'Components/DonorProfile';
import ProtectedRoute from 'Components/ProtectedRoute';
import DonorDonations from './Components/DonorDonations';

function App() {
    // Define handleAddProgram function here
    const handleAddProgram = formData => {
        // Logic to add program goes here
        console.log('Adding new program:', formData);
    };

    return (
        <div className="App">
            <Popup.PopupProvider>
                <Navbar />
                <Routes>
                    {' '}
                    {/* Use Routes component */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<Home />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path="/donatedItem/status/:id"
                        element={<StatusUpdate />}
                    />
                    <Route path="/donorform" element={<DonorForm />} />
                    <Route path="/donoredit" element={<DonorEdit />} />
                    <Route path="/donorlist" element={<DonorList />} />
                    <Route path="/donations" element={<DonatedItemsList />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/addprogram" element={<AddProgramPage />} />
                    <Route path="/editprogram" element={<EditProgramPage />} />
                    <Route path="/adddonation" element={<NewItemForm />} />
                    <Route
                        path="/addprogram"
                        element={
                            <AddProgramPage onAddProgram={handleAddProgram} />
                        }
                    />
                    <Route
                        path="/donations/:id"
                        element={<DonatedItemDetails />}
                    />
                    <Route
                        path="/donor-profile"
                        element={
                            <ProtectedRoute allowedRole="DONOR">
                                <DonorProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-donations"
                        element={
                            <ProtectedRoute allowedRole="DONOR">
                                <DonorDonations />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Popup.PopupProvider>
        </div>
    );
}

export default App;
