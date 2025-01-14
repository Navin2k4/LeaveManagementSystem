import mongoose from "mongoose";

const defaulterSchema = new mongoose.Schema(
  {
    roll_no: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeIn: {
      type: String,
      required: false,
    },
    observation: {
      type: String,
      required: false,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    classInchargeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    defaulterType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Defaulter = mongoose.model("Defaulter", defaulterSchema);

export default Defaulter;
