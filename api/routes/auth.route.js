import express from 'express';
import { studentsignup } from '../controllers/auth.controller.js';
import { studentsignin } from '../controllers/auth.controller.js';
import { staffsignup } from '../controllers/auth.controller.js';
import { staffsignin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/studentsignup',studentsignup);
router.post('/studentsignin',studentsignin);
router.post('/staffsignup',staffsignup);
router.post('/staffsignin',staffsignin);

export default router;