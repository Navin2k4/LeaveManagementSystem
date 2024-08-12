import nodemailer from 'nodemailer';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"VCET LEAVE MANAGEMENT" <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const generateEmailContent = (name, status, fromDate, toDate, comments,who) => {
    const formattedFromDate = new Date(fromDate).toISOString().split('T')[0];
    const formattedToDate = new Date(toDate).toISOString().split('T')[0];
    
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1f3a6e;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          p {
            margin: 0 0 10px;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            text-align: center;
            color: #666;
          }
          .footer a {
            color: #1f3a6e;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)} by ${who}</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your leave request has been ${status} by ${who} ${formattedFromDate === formattedToDate ? `for ${formattedFromDate}` : `from ${formattedFromDate} to ${formattedToDate}`}. </p>
            <p><strong>Comments:</strong> ${comments || "No Comments Yet"}</p>
          </div>
          <div class="footer">
            <p>Thank you for your attention.</p>
            <p>Best regards,</p>
            <p>Your College Leave Management Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  

export const notifyLeaveRequestStatus = async (email, name, status, fromDate, toDate, comments,who) => {
  const emailSubject = `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const emailContent = generateEmailContent(name, status, fromDate, toDate, comments,who);

  await sendEmail(email, emailSubject, emailContent);
};

// Usage example:
// await notifyLeaveRequestStatus(leaveRequest.email, leaveRequest.name, status, leaveRequest.fromDate, leaveRequest.toDate, mentorcomment);
