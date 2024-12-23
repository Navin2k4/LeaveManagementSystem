import express from "express";
import multer from "multer";
import { uploadStudentData } from "../controllers/data.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/uploadData', upload.single('file'), uploadStudentData);

export default router;
