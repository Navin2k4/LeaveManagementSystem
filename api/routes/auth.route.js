import express from "express";
import {
  changePassword,
  studentsignin,
  staffsignin,
  signout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/studentsignin", studentsignin);

router.post("/staffsignin", staffsignin);

router.put("/changePassword/:userType/:id", changePassword);

router.post("/signout", signout);

export default router;
