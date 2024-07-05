import express from "express";
import { createLeaveRequest ,getleaverequestbyUserId,getleaverequestbyMentorId,getleaverequestbyclassinchargeid} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/leave-request", createLeaveRequest);
router.get("/getleaverequest/:id",getleaverequestbyUserId);
router.get("/getleaverequestbymentorid/:id",getleaverequestbyMentorId);
router.get("/getleaverequestbyclassinchargeid/:id",getleaverequestbyclassinchargeid);
getleaverequestbyclassinchargeid

export default router;
