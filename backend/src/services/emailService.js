import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  await transporter.sendMail({
    from: `"Zentha AI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your Zentha AI password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #7C5CFC;">Reset your password</h2>
        <p>You requested a password reset for your Zentha AI account. Click the button below to set a new password. This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#7C5CFC; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color:#888; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export default { sendPasswordResetEmail };