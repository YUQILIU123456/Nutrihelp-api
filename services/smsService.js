/*
const twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  NODE_ENV,
} = process.env;

let client = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

async function sendSms(to, message) {
  if (!client || NODE_ENV === 'development') {
    console.log(`📨 [DEV SMS] to=${to} | ${message}`);
    return { sid: 'dev-sid', to, status: 'queued' };
  }

  const res = await client.messages.create({
    body: message,
    from: TWILIO_FROM,
    to,
  });
  return res;
}

module.exports = { sendSms };
*/
