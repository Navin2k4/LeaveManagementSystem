import mongoose from "mongoose";

const DeptHeadSchema = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
  },
  staff_name: {
    type: String,
    required: true,
  },
  staff_mail: {
    type: String,
    required: true,
  },
  staff_phone: {
    type: String,
  },
  staff_handle_dept: {
    type: String,
    required: true,
  },
});

const DeptHead =  mongoose.model("DeptHead", DeptHeadSchema);

export default DeptHead;
