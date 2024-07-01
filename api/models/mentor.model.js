import mongoose from 'mongoose';

const { Schema } = mongoose;

const mentorSchema = new Schema({
  name: { type: String, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  // Add more fields as needed
});

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
