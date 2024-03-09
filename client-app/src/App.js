import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes component
import Navbar from './Components/Navbar';
import Login from './Components/Login'; 
import Register from './Components/Register';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import ResetPasswordPage from './Components/ResetPasswordPage';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes> {}
          <Route path='/' element={<Home/>} />
          <Route path="/login" element={<Login />} /> {/* Use element prop to render components */}
          <Route path="/register" element={<Register />}/>
          <Route path="/about" element={<Home />}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;