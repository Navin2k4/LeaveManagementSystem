import mongoose from "mongoose";

const DeptHeadSchema = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    unique: true, // Ensure staff ID is unique
  },
  staff_name: {
    type: String,
    required: true,
  },
  staff_mail: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  staff_phone: {
    type: String,
  },
  staff_handle_dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    unique: true, // Ensure the department is unique for each DeptHead
  },
  isHod:{
    type: Boolean,
    default : false,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const DeptHead = mongoose.model("DeptHead", DeptHeadSchema);

export default DeptHead;
