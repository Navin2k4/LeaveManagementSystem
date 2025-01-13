import express from "express";
import {
  getClassInchargeBySectionId,
  getMentorById,
} from "../controllers/fetch.controller.js";

const router = express.Router();

router.get("/class-incharge/:sectionId", getClassInchargeBySectionId);
router.get("/mentor/:id", getMentorById);

export default router;
