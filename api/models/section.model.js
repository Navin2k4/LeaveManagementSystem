import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
    section_name: { 
        type: String, 
        required: true 
    },
    classIncharge: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff', 
        // BUG: Added unique to this field so that no other staff can be a classincharge if one is assigned
        unique: true,
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
