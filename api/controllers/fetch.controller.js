import Staff from "../models/staff.model.js";

export const getClassInchargeBySectionId = async (req, res, next) => {
  console.log("entered class incharge");
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
  console.log("entered mentor");
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
