import mongoose from 'mongoose';

const { Schema } = mongoose;

const classInchargeSchema = new Schema({
  name: { type: String, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', unique: true, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  // Add more fields as needed
});

const ClassIncharge = mongoose.model('ClassIncharge', classInchargeSchema);

export default ClassIncharge;
