import express from "express";
import { createLeaveRequest ,getleaverequestbyUserId} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/leave-request", createLeaveRequest);
router.get("/getleaverequest/:id",getleaverequestbyUserId);


export default router;
