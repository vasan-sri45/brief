// import nodemailer from 'nodemailer';

// const sendEmail = async (options) => {
//   // 1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT),
//   secure: Number(process.env.EMAIL_PORT) === 465,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // 2. Define the email options
//   const mailOptions = {
//     from: `Your App Name <${process.env.EMAIL_USER}>`, // Sender address
//     to: options.email, // List of receivers
//     subject: options.subject, // Subject line
//     html: options.html, // HTML body
//     text: options.text, // Plain text body
//   };

//   // 3. Send the email
//   try {
//   await transporter.sendMail(mailOptions);
//   console.log("Email sent to:", options.email);
// } catch (err) {
//   console.error("Email failed:", err);
//   throw err;
// }

// };

// export default sendEmail;

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (options) => {
//   try {
//     await resend.emails.send({
//       from: process.env.FROM_EMAIL,   // sender
//       to: options.email,              // receiver
//       subject: options.subject,
//       html: options.html,
//       text: options.text,
//     });

//     console.log("Email sent to:", options.email);
//   } catch (err) {
//     console.error("Email failed:", err);
//     throw err;
//   }
// };

// export default sendEmail;


// import { Resend } from "resend";

// const sendEmail = async (options) => {
//   const apiKey = process.env.RESEND_API_KEY;

//   if (!apiKey) {
//     throw new Error("RESEND_API_KEY is missing. Check your .env / Render env.");
//   }

//   const resend = new Resend(apiKey);

//   await resend.emails.send({
//     from: process.env.FROM_EMAIL || "onboarding@resend.dev",
//     to: options.email,
//     subject: options.subject,
//     html: options.html || "",
//     text: options.text || options.message || "",
//   });

//   console.log("Email sent to:", options.email);
// };

// export default sendEmail;



// import { Resend } from "resend";

// const sendEmail = async (options) => {
//   const apiKey = process.env.RESEND_API_KEY;

//   console.log("👉 Using RESEND_API_KEY:", apiKey?.slice(0, 10));

//   const resend = new Resend(apiKey);

//   const response = await resend.emails.send({
//     from: process.env.FROM_EMAIL,
//     to: options.email,
//     subject: options.subject,
//     html: options.html || "",
//     text: options.text || options.message || "",
//   });

//   console.log("👉 Resend response:", response);

//   console.log("Email sent to:", options.email);
// };

// export default sendEmail;

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,

      // allow string or array
      to: Array.isArray(options.email) ? options.email : [options.email],

      subject: options.subject,

      html: options.html || "",
      text: options.text || options.message || "",

      // optional reply-to (needed for contact form)
      reply_to: options.replyTo || undefined,
    });

    console.log("Email sent:", response?.data?.id);
    return response;

  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
};

export default sendEmail;
