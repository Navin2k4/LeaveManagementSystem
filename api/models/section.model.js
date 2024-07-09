import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
    section_name: { 
        type: String, 
        required: true 
    },
    classIncharge: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff', 
        required: true 
    },
    mentors: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff' 
        }
    ]
});

const Section =  mongoose.model('Section', SectionSchema);

export default Section;
