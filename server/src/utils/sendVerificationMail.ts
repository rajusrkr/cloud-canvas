import nodemailer from "nodemailer";

export async function sendVerificationMail({ email, otp }: { email: string, otp: string }) {
    const sender = process.env.NODEMAILER_EMAIL;
    const password = process.env.NODEMAILER_EMAIL_PASSWORD;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: sender,
            pass: password
        }
    })


    await transporter
        .sendMail({
            from: '"Cloud Canvas" <rsa22027@gmail.com>',
            to: email,
            replyTo: sender,
            subject: `Verification otp`,
            html: `
        <!DOCTYPE html>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fc;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        <!-- Header -->
        <tr>
            <td align="center" bgcolor="#4f46e5" style="padding: 30px 20px; border-radius: 8px 8px 0 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Cloud Canvas</h1>
                            <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 16px;">Online whiteboard Platform</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3594/3594484.png" alt="Security Shield" width="80" style="display: block;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <h2 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">Verify Your Identity</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Please use the following One-Time Password to complete your verification process. This code will expire in 5 minutes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <div style="background: #f3f4f6; border-radius: 8px; padding: 15px; display: inline-block;">
                                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">If you didn't request this code, please ignore this message or contact support if you have concerns.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td align="center" bgcolor="#f9fafb" style="padding: 30px; border-radius: 0 0 8px 8px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="color: #9ca3af; margin: 0; font-size: 14px; line-height: 1.5;">This is an automated message, please do not reply directly to this email.</p>
                            <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 14px;">From: ${sender}</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p style="color: #9ca3af; margin: 0; font-size: 14px;">&copy; 2023 Cloud Canvas. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
     `,
        })
}