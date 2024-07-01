import mongoose from 'mongoose';

const { Schema } = mongoose;

const sectionSchema = new Schema({
  name: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  classIncharge: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassIncharge' },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }],
  // Add more fields as needed
});

const Section = mongoose.model('Section', sectionSchema);

export default Section;
