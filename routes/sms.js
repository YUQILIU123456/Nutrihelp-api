
const express = require('express');
const router = express.Router();
const { sendSMSCode, verifySMSCode } = require('../controller/smsController');
router.post('/send', sendSMSCode);
router.post('/verify', verifySMSCode);

module.exports = router;
