const twilio = require("twilio");
const { TWILIO_SID, TWILIO_AUTH_TOKEN } = require("../config/keys");

const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

module.exports = twilioClient;
