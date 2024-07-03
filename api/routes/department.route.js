import express from 'express';
import {
  getDepartments,
  getBatches,
  getSections,
  getMentors,
  getClassIncharges,
} from '../controllers/department.controller.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/departments/:departmentId/batches', getBatches);
router.get('/batches/:batchId/sections', getSections);
router.get('/sections/:sectionId/mentors', getMentors);
router.get('/sections/:sectionId/classIncharges', getClassIncharges);

export default router;
