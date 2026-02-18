import sendEmail from "../../utils/email.js";

export const sendContactMail = async (req, res) => {
  try {
    const {
      inquiryPurpose,
      description,
      fullName,
      email,
      organization,
      phone,
      message,
    } = req.body;

    // validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // email template
    const html = `
      <h2>📩 New Inquiry Received</h2>

      <p><b>Name:</b> ${fullName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Organization:</b> ${organization || "-"}</p>

      <hr/>

      <p><b>Inquiry Purpose:</b> ${inquiryPurpose}</p>
      <p><b>Description:</b> ${description}</p>

      <p><b>Message:</b></p>
      <p>${message}</p>
    `;

    await sendEmail({
      email: process.env.ADMIN_EMAIL,   // your receiving email
      subject: `New Contact Form: ${fullName}`,
      html,
      replyTo: email,                   // so you can reply directly
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Contact mail error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
