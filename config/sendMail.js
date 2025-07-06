const nodemailer = require('nodemailer');

const sendOrderMail = async (to, orderId, amount, status) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mi0364919@gmail.com',
            pass: 'ukfzzamtlmhxjzwu'
        }
    });

    const mailOptions = {
        from: `"Cafe Fresco" <${process.env.EMAIL}>`,
        to,
        subject: 'Order Confirmation - Cafe Fresco',
        html: `
            <h2>Thanks for your order!</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> $${amount}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p>We’ll notify you when your order is shipped.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOrderMail;
