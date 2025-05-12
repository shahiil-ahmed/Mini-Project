const API_URL = import.meta.env.VITE_API_URL;

export default {
    sendEmail: async (subject, message, recipient = import.meta.env.VITE_DEFAULT_EMAIL) => {
        try {
            const response = await fetch(`${API_URL}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'email',
                    recipient,
                    subject,
                    message
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Email failed:', error);
        }
    },

    sendSMS: async (message, recipient = import.meta.env.VITE_DEFAULT_PHONE) => {
        try {
            const response = await fetch(`${API_URL}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'sms',
                    recipient,
                    message
                })
            });
            return await response.json();
        } catch (error) {
            console.error('SMS failed:', error);
        }
    }
};