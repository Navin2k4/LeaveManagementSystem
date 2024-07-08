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
        isHalfDay, // Ensure these fields are extracted from req.body
        typeOfLeave, // Ensure these fields are extracted from req.body
      } = req.body;

      if (new Date(leaveEndDate) <= new Date(leaveStartDate)) {
        return res.status(400).json({
          success: false,
          message: "Leave end date must be after the start date",
        });
      }

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
      
      // Create leave request based on userType
      if (userType === 'Staff') {
        const staffLeaveRequest = new LeaveRequest({
          name,
          userId,
          userType,
          rollNo,
          regNo : null,
          forMedical,
          batchId : null,
          sectionId : null,
          departmentId,
          reason,
          classInchargeId : null,
          mentorId :null,
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
              date: null,        // Example: Set hod date to null initially
            },
          },
        });

        await staffLeaveRequest.save();

        res.status(201).json({ success: true, message: "Staff leave request submitted successfully" });
      } else if (userType === 'Student') {
        const studentLeaveRequest = new LeaveRequest({
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
          toDate: leaveEndDate,
          noOfDays,
          isHalfDay,
          isStaff: false,
        });

        await studentLeaveRequest.save();
        res.status(201).json({ success: true, message: "Student leave request submitted successfully" });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid userType specified",
        });
      }

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
      const data = await LeaveRequest.find({ mentorId: id }).sort({ createdAt: -1 });
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
      const data = await LeaveRequest.find({ classInchargeId: id }).sort({ createdAt: -1 });
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      const customError = errorHandler(500, "Internal Server Error");
      next(customError);
    }
  }

  export const updateLeaveRequestStatusByMentorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Status must be 'approved' or 'rejected'.",
        });
      }
      const leaveRequest = await LeaveRequest.findByIdAndUpdate(
        id,
        { "approvals.mentor.status": status },
        { new: true }
      );
  
      if (!leaveRequest) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }
  
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
  
  export const updateLeaveRequestStatusByClassInchargeId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Status must be 'approved' or 'rejected'.",
        });
      }
      const leaveRequest = await LeaveRequest.findByIdAndUpdate(
        id,
        { "approvals.classIncharge.status": status },
        { new: true }
      );
  
      if (!leaveRequest) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }
  
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
      const { status } = req.body;
      const validStatuses = ["approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Status must be 'approved' or 'rejected'.",
        });
      }
      const leaveRequest = await LeaveRequest.findByIdAndUpdate(
        id,
        { "approvals.hod.status": status },
        { new: true }
      );
  
      if (!leaveRequest) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }
  
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
  
  export const getleaverequestsbySectionId = async(req,res,next) =>{
    try{
      const {id} = req.params;
      const data = await LeaveRequest.find({sectionId : id}).sort({ createdAt: -1 });
      res.status(200).json(data);
    }
    catch(error){
      console.error("Error fetching leave requests:", error);
      const customError = errorHandler(500, "Internal Server Error");
      next(customError);
    }
  }
  
  // BUG: Not Working but in use in the hoddash to be fixed

  export const mentors = async (req, res) => {
    const { ids } = req.query; // Correctly extract the ids query parameter
    const sectionIDs = ids.split(','); // Assuming ids are sent as a comma-separated string
   
    try {
      const response = await Staff.find({ staff_handle_section: { $in: sectionIDs } });
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in Fetching the Data ', error.message);
      res.status(500).json({ error: 'Failed to fetch mentors' });
    }
  };
 
  export const getStaffLeaveRequests = async (req, res) => {
    const { deptId } = req.query;
    try {
      const response = await LeaveRequest.find({ departmentId : deptId , isStaff : true}).sort({ createdAt: -1 });
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in Finding the Staff\'s Leave Request ', error.message);
      res.status(500).json({ error : 'Failed to get Staff\'s Leave Request' });
    }
  };