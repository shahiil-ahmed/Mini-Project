const twilio = require('twilio')(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  send: async (to, message) => {
      try {
          await twilio.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE,
              to
          });
          console.log(`SMS sent to ${to}`);
      } catch (error) {
          console.error('SMS error:', error);
      }
  }
};