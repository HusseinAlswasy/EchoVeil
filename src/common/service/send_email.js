
import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async ({ to, subject = "Hello From S7S Dev😎", html, attachments } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"S7S_DEV" <${process.env.EMAIL_ADDRESS}>`,
            to,
            subject,
            html,
            attachments
        });

        console.log("Message sent: %s", info.accepted);
        return info.accepted.length > 0 ? true : false; 

    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

export const otp = async () => {
    return Math.floor(Math.random() * 900000) + 100000;
}

export default sendEmail;