import express from "express";
import {
  createOdRequest,
  getodrequestbyUserId,
  getodrequestbyMentorId,
  getodrequestbyclassinchargeid,
  updateOdRequestStatusByMentorId,
  updateOdRequestStatusByClassInchargeId,
  mentors,
  getodrequestsbySectionId,
  updateOdRequestStatusByHODId,
  getWardDetailsByRollNumber,
  deleteodbyId,
} from "../controllers/od.controller.js";

const router = express.Router();

router.post("/od-request", createOdRequest);
router.get("/getodrequest/:id", getodrequestbyUserId);
router.delete("/deleteod/:id", deleteodbyId);
router.get("/getodrequestbymentorid/:id", getodrequestbyMentorId);
router.get("/getodrequestbyclassinchargeid/:id", getodrequestbyclassinchargeid);

router.get("/mentors", mentors);
// router.get('/getStaffOdRequests', getStaffOdRequests);
router.get("/odrequestsbysectionid/:id", getodrequestsbySectionId);

router.post(
  "/od-requestsbymentorid/:id/status",
  updateOdRequestStatusByMentorId
);
router.post(
  "/od-requestsbyclassinchargeid/:id/status",
  updateOdRequestStatusByClassInchargeId
);
router.post("/od-requestsbyhodid/:id/status", updateOdRequestStatusByHODId);

router.get("/getWardDetailsByRollNumber/:rollNo", getWardDetailsByRollNumber);

export default router;
