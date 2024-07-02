import experss from 'express';
import { getdepartments } from '../controllers/department.controller.js'

const router = experss.Router();

router.get('/getdepartments', getdepartments);

export default router;
