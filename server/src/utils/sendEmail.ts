import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Skipping email sending: EMAIL_USER or EMAIL_PASS not defined in .env');
        return;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Add timeout to prevent hanging
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || 'Savaj Seeds'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
