var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.post('/', function(req, res, next) {
    const { name, email, material } = req.body;

    // Send thank-you email to the donor
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manoharmeda6@gmail.com',
            pass: 'qzrz ywwq vtnw wdzm'
        }
    });
  
    const mailOptions = {
        from: 'manoharmeda6@gmail.com',
        to: email,
        subject: 'Thank You for Your Donation',
        text: `Dear ${name},\n\nThank you for donating ${material} to B-Works. Your contribution is greatly appreciated.\n\nSincerely,\nThe B-Works Team`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Thank you for your donation!');
        }
    });
  
    res.json({ message: 'Form submitted successfully! Thank you for donating' });
});

module.exports = router;
