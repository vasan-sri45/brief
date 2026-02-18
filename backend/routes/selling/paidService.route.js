import { Router } from 'express';
import { createPaidService, getAllPaidServices, updatePaidService} from '../../controllers/selling/paidService.controller.js';
import {wrapAsync} from '../../utils/wrapAsync.js';
import { employeeProtectRoute, allowRoles } from '../../middleware/protectRoute.js';

const router = Router();

router.route('/')
  .post(employeeProtectRoute,allowRoles(['admin','employee']),wrapAsync(createPaidService))
  .get(employeeProtectRoute,allowRoles(['admin','employee']),wrapAsync(getAllPaidServices))
  
// router.get("/:id", employeeProtectRoute,allowRoles(['admin','employee']),wrapAsync(getPaidServiceById));
// router.get("/service-no/:serviceNo", getPaidServiceByServiceNo);
// router.get("/my", getMyPaidServices);

router.put("/:id", employeeProtectRoute, allowRoles(['admin','employee']), updatePaidService);

export default router;









