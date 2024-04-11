// var express = require('express');
// var router = express.Router();


// router.post('/', function(req, res, next) {
//   const AWS = require('aws-sdk');

// AWS.config.update({
//   accessKeyId: 'AKIAU6GDXZYYMKHJXQ5P',
//   secretAccessKey: '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',
//   region: 'us-east-2'
// });

// donor = req.body.username;

// // Create an SES instance
// const ses = new AWS.SES();

// // Define email parameters
// const params = {
//   Source: 'yrlmanoharreddymeda@gmail.com',
//   Destination: {
//     ToAddresses: ['yrlmanoharreddymeda@gmail.com']
//   },
//   Message: {
//     Subject: {
//       Data: `Thank You, ${donor} Your Donation is Making a Difference `
//     },
//     Body: {
//       Text: {
//         Data: `Dear ${donor},
        
//         Thank you for your generous donation to B-Works. Every dollar helps us move closer to our goal. Your support means everything to us.
        
//         Stay tuned for updates on how your contribution is making an impact. We're excited about what we can accomplish together!
        
//         Warm regards,
//         B-works
//         `
//       }
//     }
//   }
// };

// // Send email
// ses.sendEmail(params, (err, data) => {
//   if (err) {
//     console.log('Error sending email:', err);
//   } else {
//     console.log('Email sent successfully:', data);
//   }
// });
// //   res.render('index', { title: 'Express' });
// res.json({ message: 'Form submitted successfully! Thank you for donating' });
// });

// module.exports = router;



var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.post('/', function(req, res, next) {
  async function callMicroserviceB() {
    try {
      const username = req.body.username;
      console.log("soln:", req.body.username);
      // Replace 'http://microservice-b-url' with the actual URL of Microservice B
      const response = await axios.post('http://localhost:5001/send-email/', {username});
      console.log('Data from Microservice B:', response.data);
    } catch (error) {
      console.error('Error calling Microservice B:', error);
    }
  }
  
  // Invoke the function
  callMicroserviceB();
  res.json ('index donor');
});

module.exports = router;
