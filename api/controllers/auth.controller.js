import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Student from "../models/student.model.js";
import Staff from "../models/staff.model.js";
import { errorHandler } from "../utils/error.js";
import DeptHead from "../models/depthead.model.js";
import Department from "../models/department.model.js";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import OTP from "../models/OTP.model.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { log } from "console";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    userType,
  } = req.body;

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

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = bcryptjs.hashSync(otp, 10);

    await OTP.create( { email, otp : hashedOTP } );

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'SignUp OTP Verification',
      text: `Your OTP for Sign up is ${otp}. Please verify your OTP within 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        return next(error);
      } else {
        console.log('Email sent:', info.response);
        res.status(201).json({ message: 'Student Saved Successfully. OTP sent to the email.', email });
      }
    });
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
    const {
      _id,
      name,
      roll_no,
      register_no,
      email,
      phone,
      departmentId,
      sectionId,
      section_name,
      batchId,
      userType,
    } = student;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
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
        userType,
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
    if (
      !staff_name ||
      !staff_id ||
      !staff_email ||
      !staff_phone ||
      !staff_departmentId ||
      !password
    ) {
      return next(errorHandler(400, "All Fields Are Required"));
    }

    // Validate mentorHandlingData if present
    if (mentorHandlingData && mentorHandlingData.length > 0) {
      for (let i = 0; i < mentorHandlingData.length; i++) {
        const data = mentorHandlingData[i];
        if (!data.handlingBatchId || !data.handlingSectionId) {
          return res
            .status(400)
            .json({ message: "Invalid mentorHandlingData structure" });
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
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      if (field === "staff_id") {
        return next(errorHandler(400, "Staff ID is already in use"));
      }
      // TOFIX: Classincharge duplicate check is not functioning need to check it
      if (field === "classInchargeSectionId") {
        return next(
          errorHandler(
            400,
            "Class Incharge is already assigned for this batch section"
          )
        );
      }
      if (field === "staff_mail") {
        return next(errorHandler(400, "Email is already in use"));
      }
    }
    next(error);
  }
};
export const staffsignin = async (req, res, next) => {
  try {
    let { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    identifier = identifier.toUpperCase();

    const staff = await Staff.findOne({ staff_id: identifier });

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

    const {
      _id,
      staff_name,
      staff_mail,
      staff_phone,
      staff_handle_dept,
      isClassIncharge,
      classInchargeBatchId,
      classInchargeSectionId,
      isMentor,
      numberOfClassesHandledAsMentor,
      mentorHandlingData,
      userType,
    } = staff;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        token,
        id: identifier,
        name: staff_name,
        userId: _id,
        mail: staff_mail,
        phone: staff_phone,
        departmentId: staff_handle_dept,
        isClassIncharge,
        isMentor,
        classInchargeBatchId,
        classInchargeSectionId,
        numberOfClassesHandledAsMentor,
        mentorHandlingData,
        userType,
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
    if (
      !staff_name ||
      !staff_id ||
      !staff_email ||
      !staff_phone ||
      !staff_departmentId ||
      !password
    ) {
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

    const department = await Department.findById(staff_departmentId);
    if (!department) {
      return next(errorHandler(404, "Department not found"));
    }

    department.dept_head = newHod._id;

    await department.save();

    res.status(201).json({ message: "HoD saved successfully", department });
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
        return next(
          errorHandler(
            400,
            "Department head already exists for this department"
          )
        );
      }
    }
    next(error);
  }
};
export const hodsignin = async (req, res, next) => {
  try {
    let { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    identifier = identifier.toUpperCase();
    console.log(identifier);

    const hod = await DeptHead.findOne({ staff_id:identifier });
    console.log(hod);
    
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

    const {
      _id,
      staff_name,
      staff_mail,
      staff_phone,
      staff_handle_dept,
      isHod,
    } = hod;

    res.status(200).json({
      success: true,
      token,
      id: identifier,
      name: staff_name,
      userId: _id,
      mail: staff_mail,
      phone: staff_phone,
      departmentId: staff_handle_dept,
      isHod,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
    next(error);
  }
};

const users = [];
const otpStorage = {};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStorage[email];

  if (!storedOtp || storedOtp.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'OTP expired or invalid' });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  users.push({ email });
  delete otpStorage[email];
  res.status(200).json({ message: 'Signup completed successfully' });
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email });
    if(!otpRecord) {
      return next(errorHandler(400, 'Invalid OTP or Expired OTP'));
    }
    const isValidOTP = bcryptjs.compareSync(otp, otpRecord.otp);
    if(!isValidOTP) {
      return next(errorHandler(400, "Invalid OTP"));
    }
    await OTP.deleteOne({ email });
    res.status(201).json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
};
