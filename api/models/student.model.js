import mongoose from "mongoose";
const studentSchema = new mongoose.Schema(
  {
    roll_no: {
      type: String,
      required: true,
      unique: true,
    },
    register_no: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    student_section: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "Student",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;