import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpValidated, setOtpValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Generate OTP
        const otp_val = Math.floor(Math.random() * 10000);

        // Send OTP via Email
        try {

            var templateParams = {
                mailto: email,
                otp: otp_val
              };
              
              await emailjs.send('service_colowdq', 'template_auqd04h', templateParams, 'N55r1ckjMp3Ax_S0_').then(
                (response) => {
                  console.log('SUCCESS!', response.status, response.text);
                },
                (error) => {
                  console.log('FAILED...', error);
                },
              );
            
            setOtp(otp_val);
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
        }
    };

    const handleOtpVerification = () => {
        if (otp === parseInt(otp)) {
            setOtpValidated(true);
            navigate('/resetpassword',{ state: { email } });
        } else {
            alert('Invalid OTP');
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={handleChange} placeholder="Enter your email" />
                <button type="submit">Submit</button>
            </form>

            {otpSent && !otpValidated && (
                <div>
                    <input type="number" placeholder="Enter OTP" />
                    <button id="otp-btn" onClick={handleOtpVerification}>Verify OTP</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;