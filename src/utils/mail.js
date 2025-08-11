import Mailgen from "mailgen";
import nodemailer from "nodemailer";


const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://Taskmanagelink.com/"
        }
    })
    const emailContent = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtmlContent = mailGenerator.generate(options.mailgenContent);

    const transporter =nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mailOptions = {
        from: "taskmanager@gmail.com",
        to: options.email,
        subject: options.subject,
        text: emailContent,
        html: emailHtmlContent
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }


}
const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our service! We're excited to have you on board.",
            action: {
                instructions: "To get started, please verify your email address by clicking the button below:",
                button: {
                    color: "#19ac58ff", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl
                } 
            },
            outro: "Need help? If you have any questions, feel free to reply to this email or contact our support team.",
            signature: "Best regards,\nThe Team"
        }
    }
}

const forgetPasswordMailgenContent = (username, resetUrl) => {
    return {
        body: {
            name: username,
            intro: "You have requested to reset your password.",
            action: {
                instructions: "To reset your password, please click the button below:",
                button: {
                    color: "#19ac58ff", 
                    text: "Reset your password",
                    link: resetUrl
                } 
            },
            outro: "If you did not request a password reset, please ignore this email or contact support if you have any concerns.",
            signature: "Best regards,\nThe Team"
        }
    }
}

export { emailVerificationMailgenContent, forgetPasswordMailgenContent };