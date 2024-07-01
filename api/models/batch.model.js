import mongoose from 'mongoose';

const { Schema } = mongoose;

const batchSchema = new Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  // Add more fields as needed
});

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
