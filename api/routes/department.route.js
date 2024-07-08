import express from 'express';
import {
  getDepartments,
  getDepartmentIdByName,
  getBatches,
  getSections,
  getMentors,
  getClassIncharges,
  getSectionIdByBatchAndName,
  getDepartmentById,
  getBatchById ,
  getSectionNameById,
  getDepartmentNameByCurrentUserId
} from '../controllers/department.controller.js';

const router = express.Router();


// TODO: Seperate the section and batch route to a seperate file

router.get('/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.get('/department/:departmentName', getDepartmentIdByName); 
router.get('/departments/:departmentId/batches', getBatches);
router.get('/getDepartmentNameByCurrentUserId', getDepartmentNameByCurrentUserId);

router.get('/batches/:id', getBatchById);
router.get('/batches/:batchId/sections', getSections);
router.get('/batches/:batchId/sections/:sectionName', getSectionIdByBatchAndName);

router.get('/section/:id', getSectionNameById);
router.get('/sections/:sectionId/mentors', getMentors);
router.get("/sections/:sectionId/classIncharges", getClassIncharges);


export default router;
