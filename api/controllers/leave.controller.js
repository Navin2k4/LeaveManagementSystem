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
        forHalfDay, // Ensure these fields are extracted from req.body
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
      
      let isHalfDayLeave = null;

      if (forHalfDay && (forHalfDay.AN || forHalfDay.FN)) {
        isHalfDayLeave = [];
      
        if (forHalfDay.AN) {
          isHalfDayLeave.push("AN");
        }
        if (forHalfDay.FN) {
          isHalfDayLeave.push("FN");
        }
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
          forHalfDay: isHalfDayLeave,
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
          forHalfDay: isHalfDayLeave,
          isStaff: false,
        });

        await studentLeaveRequest.save();
        console.log(studentLeaveRequest);
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
