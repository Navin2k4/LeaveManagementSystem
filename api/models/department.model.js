import mongoose from 'mongoose';

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  // Add more fields as needed
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
