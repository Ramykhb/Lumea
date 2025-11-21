import { Resend } from "resend";
import dotenv from "dotenv";
import { frontendPath } from "../config/frontConfig.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log("Sending email to: " + to);
        const data = await resend.emails.send({
            from: "Lumea <no-reply@lumea-lb.site>",
            to,
            subject,
            html: htmlContent,
        });
        console.log("Email sent to: " + to);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
};

export const generateHTML = (token) => {
    const resetLink = `${frontendPath}/reset-password/${token}`;
    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f6f8fb; margin: 0; padding: 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <tr>
        <td style="text-align: center; padding: 30px 20px 10px 20px;">
          <img src="${frontendPath}/Lumea.png" alt="Lumea Logo" width="80" style="display: block; margin: 0 auto 10px auto;" />
          <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">Password Reset Request</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6;">
            Hello,
          </p>
          <p style="color: #333333; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. You can reset it by clicking the button below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
              style="background-color: #facc15; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #666666; font-size: 14px; line-height: 1.6;">
            This link will expire in <strong>15 minutes</strong>. If you didn’t request a password reset, you can safely ignore this email.
          </p>

          <p style="color: #666666; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:<br />
            <a href="${resetLink}" style="color: #1052EB; word-break: break-all;">${resetLink}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f3f6; text-align: center; padding: 20px; border-top: 1px solid #eee; border-radius: 0 0 10px 10px;">
          <p style="color: #999999; font-size: 13px; margin: 0;">
            © ${new Date().getFullYear()} Lumea. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
    return htmlContent;
};
