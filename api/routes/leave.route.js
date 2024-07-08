import express from "express";
import { createLeaveRequest ,getleaverequestbyUserId,getleaverequestbyMentorId,getleaverequestbyclassinchargeid, updateLeaveRequestStatusByMentorId, updateLeaveRequestStatusByClassInchargeId, mentors, getleaverequestsbySectionId, updateLeaveRequestStatusByHODId, getStaffLeaveRequests} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/leave-request", createLeaveRequest);
router.get("/getleaverequest/:id",getleaverequestbyUserId);
router.get("/getleaverequestbymentorid/:id",getleaverequestbyMentorId);
router.get("/getleaverequestbyclassinchargeid/:id",getleaverequestbyclassinchargeid);


router.post("/leave-requestsbymentorid/:id/status", updateLeaveRequestStatusByMentorId);
router.post("/leave-requestsbyclassinchargeid/:id/status", updateLeaveRequestStatusByClassInchargeId);
router.post("/leave-requestsbyhodid/:id/status", updateLeaveRequestStatusByHODId);
router.get("/leaverequestsbysectionid/:id",getleaverequestsbySectionId);
router.get("/mentors", mentors);
router.get('/getStaffLeaveRequests', getStaffLeaveRequests);



export default router;
