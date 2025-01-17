import nodemailer from "nodemailer";
import schedule from "node-schedule";
import LeaveRequest from "../models/leave.model.js";
import transporter from "../utils/transporter.js";

let hours = 0,
  minutes = 0;

export const changeMailSendTiming = (req, res) => {
  const { time } = req.body;
  if (!time) {
    return res.status(400).json({
      success: false,
      message: "Time is required",
    });
  }

  try {
    [hours, minutes] = time.split(":");

    console.log("Hours:", hours);
    console.log("Minutes:", minutes);

    scheduleMail(hours, minutes);
    res.status(200).json({
      success: true,
      message: "Time changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the time.",
    });
  }
};

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"VCET Connect" <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const generateEmailContent = (
  name,
  status,
  fromDate,
  toDate,
  comments,
  who
) => {
  const formattedFromDate = new Date(fromDate).toISOString().split("T")[0];
  const formattedToDate = new Date(toDate).toISOString().split("T")[0];

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
            <h1>Leave Request ${
              status.charAt(0).toUpperCase() + status.slice(1)
            } by ${who}</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your leave request has been ${status} by ${who} ${
    formattedFromDate === formattedToDate
      ? `for ${formattedFromDate}`
      : `from ${formattedFromDate} to ${formattedToDate}`
  }. </p>
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

export const notifyLeaveRequestStatus = async (
  email,
  name,
  status,
  fromDate,
  toDate,
  comments,
  who
) => {
  const emailSubject = `Leave Request ${
    status.charAt(0).toUpperCase() + status.slice(1)
  } by ${who}`;
  const emailContent = generateEmailContent(
    name,
    status,
    fromDate,
    toDate,
    comments,
    who
  );

  await sendEmail(email, emailSubject, emailContent);
};

export const notifyOdRequestStatus = async (
  email,
  name,
  status,
  fromDate,
  toDate,
  comments,
  who
) => {
  const emailSubject = `Leave Request ${
    status.charAt(0).toUpperCase() + status.slice(1)
  } by ${who}`;
  const emailContent = generateEmailContent(
    name,
    status,
    fromDate,
    toDate,
    comments,
    who
  );

  await sendEmail(email, emailSubject, emailContent);
};

// Usage example:
// await notifyLeaveRequestStatus(leaveRequest.email, leaveRequest.name, status, leaveRequest.fromDate, leaveRequest.toDate, mentorcomment);

const sendConsolidatedEmails = async () => {
  try {
    const leaveRequests = await LeaveRequest.find({
      status: { $in: ["pending", "approved", "rejected"] },
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      }, // Fetch requests in the last day
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

        if (!groupedByMentors[mentorEmail]) {
          groupedByMentors[mentorEmail] = {};
        }

        // Group by batch and section within each mentor
        const batchName = request.batchId.batch_name;
        const sectionName = request.sectionId.section_name;

        if (!groupedByMentors[mentorEmail][batchName]) {
          groupedByMentors[mentorEmail][batchName] = {};
        }

        if (!groupedByMentors[mentorEmail][batchName][sectionName]) {
          groupedByMentors[mentorEmail][batchName][sectionName] = [];
        }

        groupedByMentors[mentorEmail][batchName][sectionName].push(request);
      }
    });

    const groupedByClassIncharge = {};
    leaveRequests.forEach((request) => {
      if (request.classInchargeId) {
        const classInchargeEmail = request.classInchargeId.staff_mail;
        if (!groupedByClassIncharge[classInchargeEmail]) {
          groupedByClassIncharge[classInchargeEmail] = [];
        }
        groupedByClassIncharge[classInchargeEmail].push(request);
      }
    });

    // Grouping leave requests by department, batch, and section for department heads
    const groupedByDeptHeads = {};
    leaveRequests.forEach((request) => {
      if (request.departmentId && request.departmentId.dept_head) {
        const deptHeadEmail = request.departmentId.dept_head.staff_mail;

        if (!groupedByDeptHeads[deptHeadEmail]) {
          groupedByDeptHeads[deptHeadEmail] = {};
        }

        // Group by batch and section within each department
        const batchName = request.batchId.batch_name;
        const sectionName = request.sectionId.section_name;

        if (!groupedByDeptHeads[deptHeadEmail][batchName]) {
          groupedByDeptHeads[deptHeadEmail][batchName] = {};
        }

        if (!groupedByDeptHeads[deptHeadEmail][batchName][sectionName]) {
          groupedByDeptHeads[deptHeadEmail][batchName][sectionName] = [];
        }

        groupedByDeptHeads[deptHeadEmail][batchName][sectionName].push(request);
      }
    });

    // Send emails to mentors
    for (const [email, batches] of Object.entries(groupedByMentors)) {
      const htmlContent = generateMentorEmailContent(batches);
      console.log(`Sending consolidated email to Mentor: ${email}`);
      await sendEmail(email, "Daily Leave Requests Summary", htmlContent);
    }

    for (const [email, requests] of Object.entries(groupedByClassIncharge)) {
      const htmlContent = generateClassInchargeEmailContent(requests);
      console.log(`Sending email to Class Incharge: ${email}`);
      await sendEmail(email, "Daily Leave Requests Summary", htmlContent);
    }

    // Send emails to department heads
    for (const [email, batches] of Object.entries(groupedByDeptHeads)) {
      const htmlContent = generateDeptHeadEmailContent(batches);
      console.log(`Sending consolidated email to DeptHead: ${email}`);
      await sendEmail(email, "Daily Leave Requests Summary", htmlContent);
    }

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending consolidated emails:", error);
  }
};

const generateMentorEmailContent = (batches) => {
  let content = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Dear Mentor, here is the summary of leave requests for your sections:
        </p>
  `;

  // Iterate over each batch
  for (const [batchName, sections] of Object.entries(batches)) {
    content += `<h3 style="font-size: 20px;">Batch: ${batchName}</h3>`;

    // Iterate over each section in the batch
    for (const [sectionName, requests] of Object.entries(sections)) {
      content += `<h4 style="font-size: 18px;">Section: ${sectionName}</h4>`;
      content += `
        <ul style="list-style: none; padding: 0; margin: 0;">
      `;

      requests.forEach((req) => {
        content += `
          <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${
              req.name
            }</p>
            <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(
              req.fromDate
            ).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(
              req.toDate
            ).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${
              req.reason
            }</p>
            <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
              <span style="color: ${
                req.status === "approved"
                  ? "#4CAF50"
                  : req.status === "rejected"
                  ? "#F44336"
                  : "#FF9800"
              };">
                ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </p>
          </li>
        `;
      });

      content += `</ul>`;
    }
  }

  content += `
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Thank you for your attention. Please log in to the system to review further details.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://leavemanagementsystemvcetmadurai.onrender.com/signin" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
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

const generateClassInchargeEmailContent = (requests) => {
  let content = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Dear ClassIncharge, here is the summary of leave requests submitted in the last 24 hours:
      </p>
      <ul style="list-style: none; padding: 0; margin: 0;">`;

  requests.forEach((req) => {
    content += `
        <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${
            req.name
          }</p>
          <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(
            req.fromDate
          ).toLocaleDateString()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(
            req.toDate
          ).toLocaleDateString()}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${
            req.reason
          }</p>
          <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
            <span style="color: ${
              req.status === "approved"
                ? "#4CAF50"
                : req.status === "rejected"
                ? "#F44336"
                : "#FF9800"
            };">
              ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </p>
        </li>`;
  });

  content += `</ul>
      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Thank you for your attention. Please log in to the system to review further details.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://leavemanagementsystemvcetmadurai.onrender.com/signin" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
          Visit Website
        </a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; text-align: center; padding: 15px; border-top: 1px solid #ddd;">
      <p style="margin: 0; font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>`;
  return content;
};

const generateDeptHeadEmailContent = (batches) => {
  let content = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Daily Leave Requests Summary</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Dear Department Head, here is the summary of leave requests for your department:
        </p>
  `;

  // Iterate over each batch
  for (const [batchName, sections] of Object.entries(batches)) {
    content += `<h3 style="font-size: 20px;">Batch: ${batchName}</h3>`;

    // Iterate over each section in the batch
    for (const [sectionName, requests] of Object.entries(sections)) {
      content += `<h4 style="font-size: 18px;">Section: ${sectionName}</h4>`;
      content += `
        <ul style="list-style: none; padding: 0; margin: 0;">
      `;

      requests.forEach((req) => {
        content += `
          <li style="border-bottom: 1px solid #ddd; padding: 15px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Name:</strong> ${
              req.name
            }</p>
            <p style="margin: 0; font-size: 14px;"><strong>From:</strong> ${new Date(
              req.fromDate
            ).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>To:</strong> ${new Date(
              req.toDate
            ).toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Reason:</strong> ${
              req.reason
            }</p>
            <p style="margin: 0; font-size: 14px;"><strong>Status:</strong> 
              <span style="color: ${
                req.status === "approved"
                  ? "#4CAF50"
                  : req.status === "rejected"
                  ? "#F44336"
                  : "#FF9800"
              };">
                ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </p>
          </li>
        `;
      });

      content += `</ul>`;
    }
  }

  content += `
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Thank you for your attention. Please log in to the system to review further details.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://leavemanagementsystemvcetmadurai.onrender.com/signin" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; border-radius: 5px; display: inline-block;">
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
export const scheduleMail = (hours, minutes) => {
  console.log("H:" + hours);
  console.log("M:" + minutes);
  schedule.scheduleJob(`${minutes}  ${hours} * * *`, sendConsolidatedEmails);
};
