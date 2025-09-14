const supabase = require('../dbConnection');
const { addMfaToken, verifyMfaToken } = require('../model/addMfaToken');

let twilioClient = null;
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  NODE_ENV,
  JWT_TOKEN, 
} = process.env;

try {
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  twilioClient = null;
}

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


async function sendSMSCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('user_id, contact_number')
      .eq('email', email)
      .single();

    if (userErr || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.contact_number) {
      return res.status(400).json({ error: 'No phone number on file' });
    }

    const code = genCode();
    await addMfaToken(user.user_id, code);
    const text = `NutriHelp security code: ${code}. It expires in 10 minutes. Do not share this code.`;

    if (!twilioClient || NODE_ENV === 'development') {
      console.log(`📨 [DEV SMS] to=${user.contact_number} | ${text}`);
    } else {
      await twilioClient.messages.create({
        body: text,
        from: TWILIO_FROM,
        to: user.contact_number,
      });
    }

    return res.status(200).json({ message: 'Code sent via SMS' });
  } catch (err) {
    console.error('❌ sendSMSCode error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


async function verifySMSCode(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and 6-digit code are required' });
    }
    if (String(code).length !== 6) {
      return res.status(400).json({ error: 'Invalid code format' });
    }
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (userErr || !user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const ok = await verifyMfaToken(user.user_id, code);
    if (!ok) return res.status(401).json({ error: 'Invalid or expired code' });

  

    return res.status(200).json({ message: 'SMS MFA verified' });
  } catch (err) {
    console.error('❌ verifySMSCode error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  sendSMSCode,
  verifySMSCode,
};
