var express = require('express');
var router = express.Router();
const { connect, StringCodec } = require('nats');
const AWS = require('aws-sdk');
const env  = require('../env');

const ses = new AWS.SES({
    accessKeyId: env.ACCKEY,
    secretAccessKey: env.secKey,
    region: 'us-east-2'
});

// Define an async function to connect to NATS
async function connectToNATS() {
    const nc = await connect({
        servers: ['nats://localhost:4222'] // Update to use 127.0.0.1 instead of ::1
    });
    console.log("NATS connection established");
    return nc;
}

// Handle connection errors
connectToNATS()
    .then((nc) => {
        console.log("NATS connection resolved");
        // Define router routes inside the then block
        router.post('/', function (req, res, next) {
            const { to, subject, body } = req.body;
            console.log(subject);
            console.log(nc);
            if (nc && nc.publish) {
                nc.publish('email.send', sc.encode(JSON.stringify({ to, subject, body })));
                res.send("Email request sent to NATS queue");
            } else {
                res.status(500).send('NATS connection is not available');
            }
        });
    })
    .catch((err) => {
        console.error('Failed to connect to NATS:', err);
    });

module.exports = router;
