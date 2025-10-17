const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_live_6a9e3b3a19ad94265df379c6b24fba7586b44423';
const WHATSAPP_NUMBER = '254728626642';

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/verify-payment', async (req, res) => {
    const { reference, service, quantity, charge, link, phone } = req.body;
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
        });
        if (response.data.data.status === 'success') {
            // Payment successful
            const message = `Hi Dark Anon 👋,\n\nOrder Details:\nService: ${service}\nQuantity: ${quantity}\nAmount: KSh ${charge}\nLink: ${link}\nPhone: ${phone}`;
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            return res.json({ success: true, whatsapp: whatsappURL });
        } else {
            // Payment failed
            return res.json({ success: false });
        }
    } catch (err) {
        return res.json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));