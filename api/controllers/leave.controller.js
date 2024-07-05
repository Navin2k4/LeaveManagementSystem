import LeaveRequest from "../models/leave.model.js";
import {errorHandler} from '../utils/error.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const {
    name,
    userId,
    userType,
    rollNo,
    regNo,
    forMedical,
    batchId,
    sectionId,
    departmentId,
    reason,
    classInchargeId,
    mentorId,
    leaveStartDate,
    leaveEndDate,
    noOfDays,
    } = req.body;

    // Example validation logic
    if (new Date(leaveEndDate) <= new Date(leaveStartDate)) {
      return res.status(400).json({
        success: false,
        message: "Leave end date must be after the start date",
      });
    }

    // Check if the user already has a leave request for the same period
    const existingLeave = await LeaveRequest.findOne({
      userId,
      $or: [
        { leaveStartDate: { $lte: leaveEndDate }, leaveEndDate: { $gte: leaveStartDate } },
        { leaveStartDate: { $gte: leaveStartDate }, leaveEndDate: { $lte: leaveEndDate } },
      ],
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "You already have a leave request for this period",
      });
    }

    // Proceed with creating the leave request
    const leaveRequest = new LeaveRequest({
      name,
      userId,
      userType,
      rollNo,
      regNo,
      forMedical,
      batchId,
      sectionId,
      departmentId,
      reason,
      classInchargeId,
      mentorId,
      fromDate: leaveStartDate,
      toDate: leaveEndDate ,
      noOfDays,
      isStaff: false,
    });

    await leaveRequest.save();

    res.status(201).json({ success: true, message: "Leave request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while submitting the leave request" });
  }
};

export const getleaverequestbyUserId = async (req,res,next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ userId: id }).sort({ createdAt: -1 }); 
    res.status(200).json(data);
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);  
  }
};


export const getleaverequestbyMentorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ mentorId: id });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
}

export const getleaverequestbyclassinchargeid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await LeaveRequest.find({ classInchargeId: id });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
}
