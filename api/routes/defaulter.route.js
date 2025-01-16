import express from "express";
import {
  getDefaulterReport,
  getStudentDetailsByRollNo,
  markDefaulter,
  getDefaulters,
} from "../controllers/defaulter.controller.js";

const router = express.Router();

router.get(
  "/getStudentDetailsByRollforDefaulters/:roll_no",
  getStudentDetailsByRollNo
);

router.post("/markDefaulter/", markDefaulter);

router.get(
  "/getDefaulterReport/:defaulterType/:fromDate/:toDate",
  getDefaulterReport
);

router.get("/getDefaulters", getDefaulters);

export default router;
