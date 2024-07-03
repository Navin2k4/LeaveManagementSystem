import Leave from '../models/leave.model.js';
import Department from '../models/department.model.js';
import Staff from '../models/staff.model.js';

export const createLeaveRequest = async (req, res, next) => {
  const {
    rollNo,
    leaveStartDate,
    leaveEndDate,
    name,
    regNo,
    year,
    section,
    department,
    reason,
    classInchargeId,
    mentorId
  } = req.body;

  try {
    const newLeaveRequest = new Leave({
      rollNo,
      leaveStartDate,
      leaveEndDate,
      name,
      regNo,
      year,
      section,
      department,
      reason,
      classInchargeId,
      mentorId
    });

    await newLeaveRequest.save();
    res.status(201).json(newLeaveRequest);
  } catch (error) {
    next(error);
  }
};
