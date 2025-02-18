import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import  prisma  from '../prismaClient'; 
import { fetchImagesFromCloud } from './donatedItemService';

dotenv.config(); // Load environment variables

// Log SMTP credentials to check if they're correctly loaded (excluding the password for security)
console.log('SMTP Config:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('Secure:', process.env.SMTP_SECURE);
console.log('User:', process.env.SMTP_USER);
console.log('Pass is set:', !!process.env.SMTP_PASS); // Check if the password is set without printing it

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
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('✅ SMTP Server is Ready to Send Emails');
    }
});

// Function to send a welcome email to a new donor
export const sendWelcomeEmail = async (
    recipientEmail: string,
    donorName: string,
) => {
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

const convertImageToBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64String}`; // Adjust format if needed
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

export const sendDonationEmail = async (
    recipientEmail: string,
    donorName: string,
    itemType: string,
    dateDonated: Date,
    imageUrls: string[],
    
) => {
    const encodedImages = await fetchImagesFromCloud(imageUrls);

    console.log("Image URLs being sent:", imageUrls);
    console.log("Encoded Images:", encodedImages);

    // Extract image URLs (flatten in case of multiple statuses)
    // const base64Images = await Promise.all(
   
    //         item.imageUrls.map(async (url) => await convertImageToBase64(url))
    //     )
    // );
    const formattedDate = dateDonated.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const imageSection =
    encodedImages.length > 0
            ? `<p>Here are the images of your donation:</p>
           <div>${encodedImages
               .map(
                base64 => `<img src="${base64}"  
            alt="Donation Image" width="200" style="margin:5px; border-radius:8px; max-width:100%;">`,
               )
               .join('')}</div>`
            : `<p>No images were provided for this donation.</p>`;

    const mailOptions = {
        from: `Donation Team <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Donation Confirmation',
        html: `
            <h2>Dear ${donorName},</h2>
            <p>Thank you for your generous donation!</p>
            <p>We received your <strong>${itemType}</strong> on <strong>${formattedDate}</strong>.</p>
            ${imageSection}
            
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
