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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  staff_handle_batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  staff_handle_section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
  },
  staff_role: {
    type: String,
    required: true,
    default: 'Staff'
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  isClassIncharge: {
    type: Boolean,
    default: false,
  },
  isPEStaff:{
    type: Boolean,
    default: false,
  },
  isHod:{
    type: Boolean,
    default: false,
  },
  classInchargeBatchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default:null,
  },
  classInchargeSectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    // TOFIX: Classincharge duplicate check is not functioning need to check it 
    // unique: true,
    default:null,
  },
  numberOfClassesHandledAsMentor: {
    type: Number,
  },
  mentorHandlingData: [{
    handlingBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    handlingSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    }
  }],
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "Staff",
  },
});

const Staff = mongoose.model("Staff", StaffSchema);

export default Staff;
