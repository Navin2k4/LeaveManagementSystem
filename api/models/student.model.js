import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    roll_no: {
      type: String,
      required: true,
      unique: true
    },
    register_no: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    student_section: {
      type: String,
      required: true
    },
    batch:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;


// TODO: Create a Leave Model
// TODO: Requesting a Leave Form Creating a Leave Form and Use the current user to get the user details to fill the forom at first
// TODO: Submit the Form Upload it to the database use the satee to render it dynamically and display it on the student dashboard  (Under Private Route)
