import Mailgen from "mailgen";

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
                    color: "#19ac58ff", // Optional action button color
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