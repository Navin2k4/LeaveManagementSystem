import express from 'express';
import { studentsignup, verifyOTP, changePassword } from '../controllers/auth.controller.js';
import { studentsignin } from '../controllers/auth.controller.js';
import { staffsignup } from '../controllers/auth.controller.js';
import { staffsignin } from '../controllers/auth.controller.js';
import { hodsignup } from '../controllers/auth.controller.js';
import { hodsignin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/studentsignup',studentsignup);
router.post('/studentsignin',studentsignin);

router.post('/staffsignup',staffsignup);
router.post('/staffsignin',staffsignin);

router.post('/hodsignup',hodsignup);
router.post('/hodsignin',hodsignin);

router.post('/verifyOTP', verifyOTP);

router.put('/changePassword/:userType/:id', changePassword);

export default router;