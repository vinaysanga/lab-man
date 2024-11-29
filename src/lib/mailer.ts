import nodemailer from "nodemailer";

// Replace these with your actual credentials
const transporter = nodemailer.createTransport({
  // service: "gmail",
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  // auth: {
  // user: process.env.EMAIL_USER,
  // pass: process.env.EMAIL_PASS,
  // },
  host: "10.0.0.60",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: "lab-man@robot.univaq.it",
    to,
    subject,
    text,
  };

  try {
    transporter.verify(function (error, success) {
      if (success) {
        console.log("Connected to email server");
      } else {
        console.log(error);
      }
    });
    const info = await transporter.sendMail(mailOptions);
    return {
      status: 200,
      info,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      error,
      message: "Failed to send email",
    };
  }
};
