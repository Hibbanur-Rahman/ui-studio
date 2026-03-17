import * as fsUtil from "fs";
import * as pathUtil from "path";
import * as nodemailer from "nodemailer";

interface EmailUser {
  username: string;
  email: string;
  mobile?: string;
}


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // Use false for port 587 (STARTTLS), true for port 465 (SSL/TLS)
  requireTLS: true, // Force TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSKEY,
  },
});


// Registration OTP email function
const SendRegistrationOTPEmail = async (data: {
  email: string,
  username: string,
  otp: string
}) => {
  const { email, username, otp } = data;

  try {
    // Read the content of the HTML file
    const templatePath = pathUtil.join(
      __dirname,
      "registrationEmailOTP.html"
    );
    let template = fsUtil.readFileSync(templatePath, "utf8");

    // Replace the placeholder [userName] with the actual username
    template = template.replace("[userName]", username);
    template = template.replace("[OTP]", otp);
    template = template.replace("[email]", email);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"VertEV" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your OTP for Registration",
      html: template,
    });

    console.log("Registration OTP email sent: %s", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      email: email,
      type: 'REGISTRATION_OTP'
    };
  } catch (error: any) {
    console.error("Error sending registration OTP email:", error);
    return {
      success: false,
      error: error.message,
      email: email,
      type: 'REGISTRATION_OTP'
    };
  }
};

// Login OTP email function
const SendLoginOTPEmail = async (data: {
  email: string,
  username: string,
  otp: string,
  ipAddress?: string,
  deviceInfo?: string
}) => {
  const { email, username, otp, ipAddress, deviceInfo } = data;

  try {
    // Read the content of the HTML file
    const templatePath = pathUtil.join(
      __dirname,
      "loginEmailOTP.html"
    );
    let template = fsUtil.readFileSync(templatePath, "utf8");

    // Replace the placeholders
    template = template.replace("[userName]", username);
    template = template.replace("[OTP]", otp);
    template = template.replace("[email]", email);
    template = template.replace("[timestamp]", new Date().toISOString());
    template = template.replace("[ipAddress]", ipAddress || 'Unknown');
    template = template.replace("[deviceInfo]", deviceInfo || 'Unknown Device');

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"VertEV" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your OTP for Login",
      html: template,
    });

    console.log("Login OTP email sent: %s", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      email: email,
      type: 'LOGIN_OTP'
    };
  } catch (error: any) {
    console.error("Error sending login OTP email:", error);
    return {
      success: false,
      error: error.message,
      email: email,
      type: 'LOGIN_OTP'
    };
  }
};


async function SendRegistrationEmail(email: string, username: string): Promise<void> {
  try {
    // Read the content of the HTML file
    const templatePath = pathUtil.join(
      __dirname,
      "../services",
      "registrationEmail.html"
    );
    let template = fsUtil.readFileSync(templatePath, "utf8");

    // Replace the placeholder [Username] with the actual username
    template = template.replace("[Username]", username);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Bharatiyacare" <support@bharatiyacare.com>',
      to: email,
      subject: "Congratulations",
      html: template,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

const SendForgotPasswordEmail = async (email: string, username: string, redirectUrl: string, otp: string): Promise<void> => {
  try {
    // Read the content of the HTML file
    const templatePath = pathUtil.join(
      __dirname,
      "../services",
      "forgotPasswordEmail.html"
    );
    let template = fsUtil.readFileSync(templatePath, "utf8");

    // Replace the placeholder [Username] with the actual username
    template = template.replace("[Username]", username);
    template = template.replace("[OTP]", otp);
    template = template.replace("[URL]", redirectUrl);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Bharatiyacare" <support@bharatiyacare.com>',
      to: email,
      subject: "Forgot Password",
      html: template,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Admin Forgot Password OTP email function
const SendAdminForgotPasswordOTP = async (data: {
  email: string,
  username: string,
  otp: string
}) => {
  const { email, username, otp } = data;

  try {
    // Read the content of the HTML file
    const templatePath = pathUtil.join(
      __dirname,
      "forgotPasswordEmail.html"
    );
    let template = fsUtil.readFileSync(templatePath, "utf8");

    // Replace the placeholders
    template = template.replace("[Username]", username);
    template = template.replace("[OTP]", otp);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"VertEV Admin" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your Password - VertEV Admin",
      html: template,
    });

    console.log("Admin forgot password OTP email sent: %s", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      email: email,
      type: 'ADMIN_FORGOT_PASSWORD_OTP'
    };
  } catch (error: any) {
    console.error("Error sending admin forgot password OTP email:", error);
    return {
      success: false,
      error: error.message,
      email: email,
      type: 'ADMIN_FORGOT_PASSWORD_OTP'
    };
  }
};

export {
  SendRegistrationOTPEmail,
  SendLoginOTPEmail,
  SendRegistrationEmail,
  SendForgotPasswordEmail,
  SendAdminForgotPasswordOTP
};
