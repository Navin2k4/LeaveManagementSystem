import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Student from "../models/student.model.js";
import Staff from "../models/staff.model.js";
import { errorHandler } from "../utils/error.js";
import DeptHead from "../models/depthead.model.js";

// HACK : Now the Student can select the department from the db and its object id is stored make easier to develop later:

export const studentsignup = async (req, res, next) => {
  const {
    roll_no,
    register_no,
    password,
    name,
    email,
    phone,
    departmentId,
    sectionId,
    section_name,
    batchId,
    userType
  } = req.body;

  console.log(section_name);

  if (
    !roll_no ||
    !register_no ||
    !password ||
    !name ||
    !email ||
    !phone ||
    !departmentId ||
    !sectionId ||
    !section_name ||
    !batchId
  ) {
    return next(errorHandler(400, "All Fields Are Required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newStudent = new Student({
    roll_no,
    register_no,
    password: hashedPassword,
    name,
    email,
    phone,
    departmentId,
    sectionId,
    section_name,
    batchId,
    userType,
  });

  try {
    await newStudent.save();
    res.status(201).json({ message: "Student saved successfully" });
  } catch (error) {
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      if (field === "roll_no") {
        return next(errorHandler(400, "Roll Number is already in use"));
      }
      if (field === "register_no") {
        return next(errorHandler(400, "Refgister Number is already in use"));
      }
      if (field === "email") {
        return next(errorHandler(400, "Email is already in use"));
      }
    }
    next(error);
  }
};

export const studentsignin = async (req, res, next) => {
  let { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  identifier = identifier.toUpperCase();

  try {
    const student = await Student.findOne({
      $or: [{ roll_no: identifier }, { register_no: identifier }],
    });

    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Spread student properties directly into the response
    const { _id, name, roll_no, register_no, email, phone, departmentId, sectionId,section_name, batchId, userType } = student;

    res.status(200).json({
      token,
      id: _id,
      name,
      roll_no,
      register_no,
      email,
      phone,
      departmentId,
      batchId,
      sectionId,
      section_name,
      userType
    });
  } catch (error) {
    next(error);
  }
};

export const staffsignup = async (req, res, next) => {
  const {
    staff_name,
    staff_id,
    staff_email,
    staff_phone,
    staff_departmentId,
    isClassIncharge,
    classInchargeBatchId,
    classInchargeSectionId,
    isMentor,
    numberOfClassesHandledAsMentor,
    mentorHandlingData,
    password,
    userType,
  } = req.body;

  try {
    // Validate required fields
    if (!staff_name || !staff_id || !staff_email || !staff_phone || !staff_departmentId || !password) {
      return next(errorHandler(400, "All Fields Are Required"));
    }

    // Validate mentorHandlingData if present
    if (mentorHandlingData && mentorHandlingData.length > 0) {
      for (let i = 0; i < mentorHandlingData.length; i++) {
        const data = mentorHandlingData[i];
        if (!data.handlingBatchId || !data.handlingSectionId) {
          return res.status(400).json({ message: 'Invalid mentorHandlingData structure' });
        }
        // Additional validation or processing logic if needed
      }
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new Staff instance
    const newStaff = new Staff({
      staff_name,
      staff_id,
      staff_mail: staff_email,
      staff_phone,
      staff_handle_dept: staff_departmentId,
      isClassIncharge,
      classInchargeBatchId,
      classInchargeSectionId,
      isMentor,
      numberOfClassesHandledAsMentor,
      mentorHandlingData,
      password: hashedPassword,
      userType,
    });

    // Save the new staff member to the database
    await newStaff.save();

    res.status(201).json({ message: "Staff saved successfully" });
  } catch (error) {
    // Handle duplicate key error (e.g., staff ID or email already exists)
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      if (field === "staff_id") {
        return next(errorHandler(400, "Staff ID is already in use"));
      }
      if (field === "staff_mail") {
        return next(errorHandler(400, "Email is already in use"));
      }
    }
    next(error); // Forward other errors to error handler middleware
  }
};

export const staffsignin = async (req, res, next) => {
  try {
    let { staff_id, password } = req.body;

    if (!staff_id || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    staff_id = staff_id.toUpperCase();

    const staff = await Staff.findOne({ staff_id: staff_id });

    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, staff.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { _id, staff_name, staff_mail, staff_phone, staff_handle_dept, isClassIncharge, classInchargeBatchId, classInchargeSectionId, isMentor, numberOfClassesHandledAsMentor, mentorHandlingData, userType } = staff;

    res.status(200).json({
      token,
      id : staff_id,
      name: staff_name,
      userId: _id,
      mail: staff_mail,
      phone : staff_phone,
      departmentId: staff_handle_dept,
      isClassIncharge,
      isMentor,
      classInchargeBatchId,
      classInchargeSectionId,
      numberOfClassesHandledAsMentor,
      mentorHandlingData,
      userType
    });
  } catch (error) {
    next(error);
  }
};

export const hodsignup = async (req, res, next) => {
  const {
    staff_name,
    staff_id,
    staff_email,
    staff_phone,
    staff_departmentId,
    password,
    isHod,
  } = req.body;

  try {
    if (!staff_name || !staff_id || !staff_email || !staff_phone || !staff_departmentId || !password) {
      return next(errorHandler(400, "All Fields Are Required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newHod = new DeptHead({
      staff_name,
      staff_id,
      staff_mail: staff_email,
      staff_phone,
      staff_handle_dept: staff_departmentId,
      password: hashedPassword,
      isHod,
    });

    await newHod.save();

    res.status(201).json({ message: "Staff saved successfully" });
  } catch (error) {
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      if (field === "staff_id") {
        return next(errorHandler(400, "Staff ID is already in use"));
      }
      if (field === "staff_mail") {
        return next(errorHandler(400, "Email is already in use"));
      }
      if (field === "staff_handle_dept") {
        return next(errorHandler(400, "Department head already exists for this department"));
      }
    }
    next(error); 
  }
};

export const hodsignin = async (req, res, next) => {
  try {
    let { staff_id, password } = req.body;

    if (!staff_id || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    staff_id = staff_id.toUpperCase();

    const hod = await DeptHead.findOne({ staff_id });

    if (!hod) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, hod.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: hod._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { _id, staff_name, staff_mail, staff_phone, staff_handle_dept, isHod } = hod;

    res.status(200).json({
      success: true,
      token,
      id: staff_id,
      name: staff_name,
      userId: _id,
      mail: staff_mail,
      phone: staff_phone,
      departmentId: staff_handle_dept,
      isHod
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
    next(error);
  }
};