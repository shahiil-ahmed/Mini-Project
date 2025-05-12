const express = require('express');
const cors = require('cors');
const emailService = require('./services/emailService');
const smsService = require('./services/smsService');

const app = express();
app.use(cors());
app.use(express.json());

// Add these test numbers/emails for demo
const TEST_EMAIL = "shahilproject@gmail.com";
const TEST_PHONE = "+916002489401"; // Twilio test number

app.post('/api/notify', async (req, res) => {
    const { type, recipient, subject, message } = req.body;
    
    try {
        if (type === 'email') {
            await emailService.send(recipient || TEST_EMAIL, subject, message);
        } else {
            await smsService.send(recipient || TEST_PHONE, message);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Notification failed:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));