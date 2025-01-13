import LeaveRequest from "../models/leave.model.js";
import { errorHandler } from "../utils/error.js";
import { notifyLeaveRequestStatus } from "./email.service.js";

export const createLeaveRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      userType,
      rollNo,
      regNo,
      forMedical,
      batchId,
      sectionId,
      section_name,
      departmentId,
      reason,
      classInchargeId,
      mentorId,
      leaveStartDate,
      leaveEndDate,
      noOfDays,
      isHalfDay,
      typeOfLeave,
    } = req.body;

    const existingLeave = await LeaveRequest.findOne({
      userId,
      $or: [
        {
          leaveStartDate: { $lte: leaveEndDate },
          leaveEndDate: { $gte: leaveStartDate },
        },
        {
          leaveStartDate: { $gte: leaveStartDate },
          leaveEndDate: { $lte: leaveEndDate },
        },
      ],
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "You already have a leave request for this period",
      });
    }

    if (userType === "Staff") {
      const staffLeaveRequest = new LeaveRequest({
        name,
        email,
        userId,
        userType,
        rollNo,
        regNo: null,
        forMedical,
        batchId: null,
        sectionId: null,
        section_name,
        departmentId,
        reason,
        classInchargeId: null,
        mentorId: null,
        fromDate: leaveStartDate,
        toDate: leaveEndDate,
        noOfDays,
        isHalfDay,
        typeOfLeave, // Include these fields for staff leave request
        isStaff: true,
        approvals: {
          mentor: {
            status: "approved",
            date: new Date(),
          },
          classIncharge: {
            status: "approved",
            date: new Date(),
          },
          hod: {
            status: "pending", // Example: Set hod status to pending
            date: null, // Example: Set hod date to null initially
          },
        },
      });

      await staffLeaveRequest.save();

      res.status(201).json({
        success: true,
        message: "Staff leave request submitted successfully",
      });
    } else if (userType === "Student") {
      const studentLeaveRequest = new LeaveRequest({
        name,
        email,
        userId,
        userType,
        rollNo,
        regNo,
        forMedical,
        batchId,
        sectionId,
        section_name,
        departmentId,
        reason,
        classInchargeId,
        mentorId,
        fromDate: leaveStartDate,
        toDate: leaveEndDate,
        noOfDays,
        isHalfDay,
        isStaff: false,
      });
      await studentLeaveRequest.save();
      res.status(201).json({
        success: true,
        message: "Student leave request submitted successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid userType specified",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the leave request",
    });
  }
};

export const deleteleavebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLeave = await LeaveRequest.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getleaverequestbyUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ userId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getleaverequestbyMentorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ mentorId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getleaverequestbyclassinchargeid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ classInchargeId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateLeaveRequestStatusByMentorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, mentorcomment } = req.body;
    const validStatuses = ["approved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        "approvals.mentor.status": status,
        $set: {
          mentorcomment:
            mentorcomment !== "" ? mentorcomment : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }
    const who = "Mentor";
    await leaveRequest.computeStatus();
    await leaveRequest.save();

    await notifyLeaveRequestStatus(
      leaveRequest.email,
      leaveRequest.name,
      status,
      leaveRequest.fromDate,
      leaveRequest.toDate,
      mentorcomment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      leaveRequest,
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateLeaveRequestStatusByClassInchargeId = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { status, classInchargeComment } = req.body;
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        "approvals.classIncharge.status": status,
        $set: {
          classInchargeComment:
            classInchargeComment !== ""
              ? classInchargeComment
              : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (leaveRequest.mentorId === null) {
      leaveRequest.approvals.mentor.status = status;
    }

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const who = "Class Incharge";
    await leaveRequest.computeStatus();
    await leaveRequest.save();
    await notifyLeaveRequestStatus(
      leaveRequest.email,
      leaveRequest.name,
      status,
      leaveRequest.fromDate,
      leaveRequest.toDate,
      classInchargeComment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      leaveRequest,
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateLeaveRequestStatusByHODId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, hodComment } = req.body;
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        "approvals.hod.status": status,
        $set: {
          hodComment: hodComment
            ? hodComment
            : ""
            ? classInchargeComment
            : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const who = "HOD";
    await leaveRequest.computeStatus();
    await leaveRequest.save();
    await notifyLeaveRequestStatus(
      leaveRequest.email,
      leaveRequest.name,
      status,
      leaveRequest.fromDate,
      leaveRequest.toDate,
      hodComment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      leaveRequest,
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getleaverequestsbySectionId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ sectionId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

// BUG: Not Working but in use in the hoddash to be fixed

export const mentors = async (req, res) => {
  const { ids } = req.query; // Correctly extract the ids query parameter
  const sectionIDs = ids.split(","); // Assuming ids are sent as a comma-separated string

  try {
    const response = await Staff.find({
      staff_handle_section: { $in: sectionIDs },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in Fetching the Data ", error.message);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
};

// export const getStaffLeaveRequests = async (req, res) => {
//   const { deptId } = req.query;
//   try {
//     const response = await LeaveRequest.find({
//       departmentId: deptId,
//       isStaff: true,
//     }).sort({ createdAt: -1 });
//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error in Finding the Staff's Leave Request ", error.message);
//     res.status(500).json({ error: "Failed to get Staff's Leave Request" });
//   }
// };

export const getWardDetailsByRollNumber = async (req, res, next) => {
  const { rollNo } = req.params;
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  try {
    const response = await LeaveRequest.find({
      rollNo: rollNo,
      fromDate: { $gte: oneMonthAgo },
    });
    res.status(200).json(response);
  } catch (error) {
    next("Error in Fetching the Ward Details", error.message);
  }
};
