import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Student from "../models/student.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {
    roll_no,
    register_no,
    password,
    name,
    email,
    phone,
    department,
    student_section,
    batch
  } = req.body;
  if (
    !roll_no ||
    !register_no ||
    !password ||
    !name ||
    !email ||
    !phone ||
    !department ||
    !student_section||
    !batch
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
    department,
    student_section,
    batch
  });
  try {
    await newStudent.save();
    res.status(201).json({ message: "Student saved successfully" });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      if (field === "roll_no") {
        return next(errorHandler(400, "Roll Number is already in use"));
      }
      if (field === "email") {
        return next(errorHandler(400, "Email is already in use"));
      }
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
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
    res.status(200).json({ token, student });
  } catch (error) {
    next(error);
  }
};
