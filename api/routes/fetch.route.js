import express from "express";
import {
  getClassInchargeBySectionId,
  getMentorById,
  getMenteeByMentorId,
  getParentPhoneNumberById,
} from "../controllers/fetch.controller.js";

const router = express.Router();

router.get("/class-incharge/:sectionId", getClassInchargeBySectionId);
router.get("/mentor/:id", getMentorById);
router.get("/mentee/:mentorId", getMenteeByMentorId);
router.post("/students/phones", getParentPhoneNumberById);
  
export default router;
