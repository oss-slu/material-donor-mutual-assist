const express = require('express');
const router = express.Router();
const amazonSESCredentials = require('../env-cred.js');
const emailBody = require('../templates/success-template.js');
const AWS = require('aws-sdk');

router.post('/', async (req, res) => {
    try {
        const { donor_name, email } = req.body;

        AWS.config.update({
            accessKeyId: amazonSESCredentials.id,
            secretAccessKey: amazonSESCredentials.key,
            region: 'us-east-2',
        });
        //create an SES session
        const ses = new AWS.SES();
        //define email parameters
        const params = {
            Source: 'garimellasirichandana@gmail.com',
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: `Thank You, ${donor_name} Your Donation is Making a Difference `,
                },
                Body: {
                    Text: {
                        Data: emailBody.replace('donor', donor_name),
                    },
                },
            },
        };
        //send email
        ses.sendEmail(params, (err, data) => {
            if (err) {
                console.log('Error sending email:', err);
                res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent successfully:', data);
                res.json({ message: 'Email sent successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

module.exports = router;
