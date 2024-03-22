var express = require('express');
var router = express.Router();
var amazonSESCredentials = require('../env-cred.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    const AWS = require('aws-sdk');

    AWS.config.update({
      accessKeyId: amazonSESCredentials.id,
      secretAccessKey: amazonSESCredentials.key,
      region: 'us-east-2'
    });

    console.log('req:', req.body);
    donor = req.body.username;

    // Create an SES instance
    const ses = new AWS.SES();

    // Define email parameters
    const params = {
      Source: 'yrlmanoharreddymeda@gmail.com',
      Destination: {
        ToAddresses: ['yrlmanoharreddymeda@gmail.com']
      },
      Message: {
        Subject: {
          Data: `Thank You, ${donor} Your Donation is Making a Difference `
        },
        Body: {
          Text: {
            Data: `Dear ${donor},
            
            Thank you for your generous donation to B-Works. Every dollar helps us move closer to our goal. Your support means everything to us.
            
            Stay tuned for updates on how your contribution is making an impact. We're excited about what we can accomplish together!
            
            Warm regards,
            B-works
            `
          }
        }
      }
    };

    // Send email
    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.log('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', data);
      }
    });
    //   res.render('index', { title: 'Express' });
    res.json({ message: 'Form submitted successfully! Thank you for donating' });

});

module.exports = router;
