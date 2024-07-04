import express from 'express';
import {
  getDepartments,
  getDepartmentIdByName,
  getBatches,
  getSections,
  getMentors,
  getClassIncharges,
  getSectionIdByBatchAndName
} from '../controllers/department.controller.js';

const router = express.Router();

router.get('/departments', getDepartments);

router.get('/department/:departmentName', getDepartmentIdByName); 
router.get('/departments/:departmentId/batches', getBatches);
router.get('/batches/:batchId/sections', getSections);
router.get('/sections/:sectionId/mentors', getMentors);
router.get('/sections/:sectionId/classIncharges', getClassIncharges);



router.get('/batches/:batchId/sections/:sectionName', getSectionIdByBatchAndName);

export default router;
