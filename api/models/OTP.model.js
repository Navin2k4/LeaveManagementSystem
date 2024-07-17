import mongoose from "mongoose";
import { MdEmail } from "react-icons/md";

const OTPschema = new mongoose.Schema({
    otp : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt : {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const OTP = mongoose.model('OTP', OTPschema);

export default OTP;