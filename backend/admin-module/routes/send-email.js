var express = require('express');
var router = express.Router();
const { connect, StringCodec } = require('nats');
const AWS = require('aws-sdk');

const ses = new AWS.SES(
    {
        accessKeyId: 'AKIAU6GDXZYYMKHJXQ5P',
        secretAccessKey: '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',
        region: 'us-east-2'
    }
)


const nc = connect({ servers: 'nats://localhost:4222' });

// Handle connection errors

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
module.exports = router;