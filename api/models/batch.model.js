import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  batch_name: {
    type: String,
    required: true,
  },
  dept_head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeptHead",
    required: true,
  },
  sections: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    },
  ],
});

const Batch =  mongoose.model("Batch", BatchSchema);

export default Batch;
