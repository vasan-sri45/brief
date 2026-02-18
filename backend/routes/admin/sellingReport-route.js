import { Router } from 'express';
import {addSellingReport, listSellingReports, getSellingReportById, searchSellingReports} from '../../controllers/admin/sellingReport-controller.js';
import {wrapAsync} from '../../utils/wrapAsync.js';
import { employeeProtectRoute, allowRoles } from '../../middleware/protectRoute.js';

const router = Router();

router.route('/')
  .post(employeeProtectRoute,allowRoles(['employee','admin']),wrapAsync(addSellingReport))
  .get(wrapAsync(listSellingReports));

router.get('/selling/search', searchSellingReports); 
router.get('/selling/:id', getSellingReportById);
export default router;
