// import express from 'express';
// import { addUserService, deleteUserService, getUserService } from '../../controllers/service/user-service.js';
// import {employeeProtectRoute, userProtectRoute} from '../../middleware/protectRoute.js';
// import {wrapAsync} from '../../utils/wrapAsync.js ';
// const router = express.Router();

// router.post('/service',employeeProtectRoute, wrapAsync(addUserService));
// router.get('/service/get',userProtectRoute, wrapAsync(getUserService));
// router.delete('/service/delete', employeeProtectRoute, wrapAsync(deleteUserService));

// export default router;     


import express from 'express';
import { addUserService, deleteUserService, getUserService } from '../../controllers/service/user-service.js';
import { employeeProtectRoute, userProtectRoute } from '../../middleware/protectRoute.js';
import { wrapAsync } from '../../utils/wrapAsync.js';

const router = express.Router();
router.post('/service', employeeProtectRoute, wrapAsync(addUserService));
router.get('/service/get', userProtectRoute, wrapAsync(getUserService));
router.delete('/service/delete', employeeProtectRoute, wrapAsync(deleteUserService));

export default router;
