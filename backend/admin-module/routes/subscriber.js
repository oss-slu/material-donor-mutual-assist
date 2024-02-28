const { connect, StringCodec } = require('nats');
const AWS = require('aws-sdk');

// Configure NATS connection
const nc = await connect({ servers: 'nats://localhost:4222' });
const sc = nc.stringCodec(StringCodec());

// Configure AWS SES
const ses = new AWS.SES({
    accessKeyId: 'AKIAU6GDXZYYMKHJXQ5P',
    secretAccessKey: '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',
    region: 'us-east-2'
});

// Subscribe to email requests
nc.subscribe('email.send', { callback: async (err, msg) => {
  if (err) {
    console.error(err);
    return;
  }

  const { to, subject, body } = JSON.parse(sc.decode(msg.data));

  // Send email using AWS SES
  const params = {
    Destination: {
      ToAddresses: ['yrlmanoharreddymeda@gmail.com']
    },
    Message: {
      Body: {
        Text: {
          Data: body
        }
      },
      Subject: {
        Data: subject
      }
    },
    Source: 'yrlmanoharreddymeda@gmail.com'
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing NATS connection');
  nc.close();
  process.exit();
});
