import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import LeaveRequest from "../models/leave.model.js";

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
  const emailSubject = `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)} by ${who}`;
  const emailContent = generateEmailContent(name, status, fromDate, toDate, comments,who);

  await sendEmail(email, emailSubject, emailContent);
};

// Usage example:
// await notifyLeaveRequestStatus(leaveRequest.email, leaveRequest.name, status, leaveRequest.fromDate, leaveRequest.toDate, mentorcomment);

const sendConsolidatedEmails = async () => {
  try {
    const leaveRequests = await LeaveRequest.find({
      status: { $in: ["pending", "approved", "rejected"] },
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) }, // Fetch requests in the last day
    })
      .populate("mentorId", "staff_mail staff_name")
      .populate("classInchargeId", "staff_mail staff_name")
      .populate({
        path: "departmentId",
        select: "dept_head", // Only populate the dept_head field in the department
        populate: {
          path: "dept_head",
          select: "staff_mail", // Get the staff_mail field from the dept_head
        },
      })
      .populate("batchId", "batch_name")
      .populate("sectionId", "section_name")
      .lean();

    // Grouping leave requests by batch and section for mentors
    const groupedByMentors = {};
    leaveRequests.forEach((request) => {
      if (request.mentorId) {
        const mentorEmail = request.mentorId.staff_mail;
        const batchSectionKey = `${request.batchId.batch_name}-${request.sectionId.section_name}`;
        
        if (!groupedByMentors[mentorEmail]) {
          groupedByMentors[mentorEmail] = {};
        }

        if (!groupedByMentors[mentorEmail][batchSectionKey]) {
          groupedByMentors[mentorEmail][batchSectionKey] = [];
        }

        groupedByMentors[mentorEmail][batchSectionKey].push(request);
      }
    });

    const groupedByClassIncharge={}
    leaveRequests.forEach((request) => {
    if (request.classInchargeId) {
      const classInchargeEmail = request.classInchargeId.staff_mail;
      if (!groupedByClassIncharge[classInchargeEmail]) {
        groupedByClassIncharge[classInchargeEmail] = [];
      }
      groupedByClassIncharge[classInchargeEmail].push(request);
    }});

    // Grouping leave requests by department, batch, and section for department heads
    const groupedByDeptHeads = {};
    leaveRequests.forEach((request) => {
      if (request.departmentId && request.departmentId.dept_head) {
        const deptHeadEmail = request.departmentId.dept_head.staff_mail;
        const deptKey = request.departmentId._id;
        const batchSectionKey = `${request.batchId.batch_name}/${request.sectionId.section_name}`;
        
        if (!groupedByDeptHeads[deptKey]) {
          groupedByDeptHeads[deptKey] = {};
        }

        if (!groupedByDeptHeads[deptKey][batchSectionKey]) {
          groupedByDeptHeads[deptKey][batchSectionKey] = { email: deptHeadEmail, requests: [] };
        }

        groupedByDeptHeads[deptKey][batchSectionKey].requests.push(request);
      }
    });

    // Send emails to mentors
    for (const [email, batches] of Object.entries(groupedByMentors)) {
      for (const [batchSectionKey, requests] of Object.entries(batches)) {
        const htmlContent = generateMentorEmailContent(requests, batchSectionKey);
        console.log(`Sending email to Mentor: ${email}`);
        await sendEmail(email, `Daily Leave Requests Summary for ${batchSectionKey}`, htmlContent);
      }
    }

    for (const [email, requests] of Object.entries(groupedByClassIncharge)) {
      const htmlContent = generateClassInchargeEmailContent(requests);
      console.log(`Sending email to Class Incharge: ${email}`);
      await sendEmail(email, "Daily Leave Requests Summary", htmlContent);
    }

    // Send emails to department heads
    for (const [deptKey, batches] of Object.entries(groupedByDeptHeads)) {
      for (const [batchSectionKey, { email, requests }] of Object.entries(batches)) {
        const [batchName, sectionName] = batchSectionKey.split("/");
        const htmlContent = generateDeptHeadEmailContent(requests, batchName, sectionName);
        console.log(`Sending email to DeptHead: ${email}`);
        await sendEmail(email, `Leave Requests for ${batchName} - ${sectionName}`, htmlContent);
      }
    }

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending consolidated emails:", error);
  }
};

const generateMentorEmailContent = (requests, batchSectionKey) => {
  let content = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="font-size: 18px;">Batch: ${batchSectionKey}</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Dear Mentor, here is the summary of leave requests for your section in the last 24 hours:
        </p>
        <ul style="list-style: none; padding: 0; margin: 0;">
  `;

  requests.forEach((req) => {
    content += `
          <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${req.name}</p>
            <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(req.fromDate).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(req.toDate).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${req.reason}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
              <span style="color: ${req.status === 'approved' ? '#4CAF50' : req.status === 'rejected' ? '#F44336' : '#FF9800'};">
                ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </p>
          </li>
    `;
  });

  content += `
        </ul>
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Thank you for your attention. Please log in to the system to review further details.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://your-website.com" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
            Visit Website
          </a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; text-align: center; padding: 15px; border-top: 1px solid #ddd;">
        <p style="margin: 0; font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  return content;
};

const generateClassInchargeEmailContent = (requests)=>{
  let content = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Dear ClassIncharge, here is the summary of leave requests submitted in the last 24 hours:
      </p>
      <ul style="list-style: none; padding: 0; margin: 0;">
;`

requests.forEach((req) => {
  content += `
        <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${req.name}</p>
          <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(req.fromDate).toLocaleDateString()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(req.toDate).toLocaleDateString()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${req.reason}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
            <span style="color: ${req.status === 'approved' ? '#4CAF50' : req.status === 'rejected' ? '#F44336' : '#FF9800'};">
              ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </p>
        </li>`
  ;
});

content += 
      `</ul>
      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Thank you for your attention. Please log in to the system to review further details.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://your-website.com" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
          Visit Website
        </a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; text-align: center; padding: 15px; border-top: 1px solid #ddd;">
      <p style="margin: 0; font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>`
;
return content;
};

const generateDeptHeadEmailContent = (requests, batchName, sectionName) => {
  let content = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="font-size: 18px;">Batch: ${batchName} - Section: ${sectionName}</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Dear Department Head, here is the summary of leave requests from your department:
        </p>
        <ul style="list-style: none; padding: 0; margin: 0;">
  `;

  requests.forEach((req) => {
    content += `
          <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${req.name}</p>
            <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(req.fromDate).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(req.toDate).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${req.reason}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
              <span style="color: ${req.status === 'approved' ? '#4CAF50' : req.status === 'rejected' ? '#F44336' : '#FF9800'};">
                ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </p>
          </li>
    `;
  });

  content += `
        </ul>
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Thank you for your attention. Please log in to the system to review further details.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://your-website.com" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
            Visit Website
          </a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; text-align: center; padding: 15px; border-top: 1px solid #ddd;">
        <p style="margin: 0; font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  return content;
};

schedule.scheduleJob("23  14 * * *", sendConsolidatedEmails);
