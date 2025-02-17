import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Log SMTP credentials to check if they're correctly loaded (excluding the password for security)
console.log("SMTP Config:");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("Secure:", process.env.SMTP_SECURE);
console.log("User:", process.env.SMTP_USER);
console.log("Pass is set:", !!process.env.SMTP_PASS); // Check if the password is set without printing it

// Configure the email transporter with SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host
    port: parseInt(process.env.SMTP_PORT || '587'), // SMTP port
    secure: process.env.SMTP_SECURE === 'true', // Use TLS if set
    auth: {
        user: process.env.SMTP_USER, // Store in environment variables
        pass: process.env.SMTP_PASS,
    },
    debug: true, // Enables SMTP debug logs
    logger: true, // Logs the entire email transaction
});

// Test transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("✅ SMTP Server is Ready to Send Emails");
    }
});

// Function to send a welcome email to a new donor
export const sendWelcomeEmail = async (recipientEmail: string, donorName: string) => {
    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Welcome to Our Donation Program!',
        html: `
            <h2>Dear ${donorName},</h2>
            <p>Thank you for joining our donation program. Your support makes a real difference!</p>
            <p>We truly appreciate your generosity and look forward to working together for a great cause.</p>
            <p>Best regards,</p>
            <p><strong>Donation Team</strong></p>
        `,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result);
    } catch (error) {
        console.log('❌ Error sending email:', error);
    }
};

// Function to send a donation confirmation email
export const sendDonationEmail = async (recipientEmail: string, donorName: string, itemType: string) => {
    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Donation Confirmation',
        html: `
            <h2>Dear ${donorName},</h2>
            <p>Thank you for your generous donation! We received your ${itemType}:</p>
            
            <p>We truly appreciate your support.</p>
            <p>Best regards,</p>
            <p><strong>Donation Team</strong></p>
        `,  
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Donation confirmation email sent:', result);
    } catch (error) {
        console.log('❌ Error sending donation email:', error);
    }
};
