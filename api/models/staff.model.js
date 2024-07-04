import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    unique: true,
  },
  staff_name: {
    type: String,
    required: true,
  },
  staff_mail: {
    type: String,
  },
  staff_phone: {
    type: String,
  },
  staff_handle_dept: {
    type: mongoose.Schema.Types.ObjectId,  // Ensure this references Department's _id
    ref: 'Department',
  },
  staff_handle_batch: {
    type: String,
  },
  staff_handle_section: {
    type: mongoose.Schema.Types.ObjectId,  // Ensure this references Section's _id
    ref: 'Section',
  },
  staff_role: {
    type: String, // 'Mentor' or 'ClassIncharge'
    required: true,
    default: 'Staff'
  },
  userType: {
    type: String,
    default: "Staff",
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

export default Staff;
