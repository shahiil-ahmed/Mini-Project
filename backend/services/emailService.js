const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {
    send: async (to, subject, message) => {
        try {
            await transporter.sendMail({
                from: `"Construction DApp" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text: message
            });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Email error:', error);
        }
    }
};