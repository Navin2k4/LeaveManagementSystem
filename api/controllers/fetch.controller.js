import Staff from "../models/staff.model.js";
import Student from "../models/student.model.js";
export const getClassInchargeBySectionId = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const classIncharge = await Staff.findOne({
      staff_handle_section: sectionId,
      isClassIncharge: true,
    });

    if (!classIncharge) {
      return res.status(404).json({ message: "Class incharge not found" });
    }
    res.status(200).json(classIncharge); // Wrap in array to maintain consistency
  } catch (error) {
    next(error);
  }
};

export const getMentorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mentor = await Staff.findOne({ _id: id });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json(mentor); // Wrap in array to maintain consistency
  } catch (error) {
    next(error);
  }
};

export const getMenteeByMentorId = async (req, res, next) => {
  try {
    const { mentorId } = req.params;
    console.log("Fetching mentees for mentor:", mentorId);

    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    const mentees = await Student.find(
      { mentorId: mentorId },
      {
        name: 1,
        roll_no: 1,
        register_no: 1,
        email: 1,
        phone: 1,
        parent_phone: 1,
        section_name: 1,
        status: 1,
        _id: 1,
      }
    ).lean();

    console.log("Found mentees:", mentees.length);
    res.status(200).json(mentees);
  } catch (error) {
    console.error("Error in getMenteeByMentorId:", error);
    next(error);
  }
};
