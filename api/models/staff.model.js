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
    type: String,
    required: true,
  },
  staff_handle_batch: {
    type: String,
  },
  staff_handle_section: {
    type: String,
  },
  staff_role: {
    type: String, //Mentor ClassIncharge
    required: true,
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

export default Staff;
