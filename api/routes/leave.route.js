import express from 'express';
import { createLeaveRequest } from '../controllers/leave.controller.js';

const router = express.Router();

router.post('/leave-request', createLeaveRequest);

export default router;
