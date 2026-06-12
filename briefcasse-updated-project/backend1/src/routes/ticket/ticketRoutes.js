import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  assignTicket,
  updateAnyTicket,
  updateAssignedTicket
} from '../../controllers/users/userTicket-controller.js';

import { userProtectRoute, employeeProtectRoute, allowRoles } from '../../middleware/protectRoute.js';

const router = express.Router();

// Users
router.post('/create', userProtectRoute, allowRoles(['user', 'employee', 'admin']), createTicket);
router.get('/my-tickets', userProtectRoute, allowRoles(['user', 'employee', 'admin']), getMyTickets);

// Employees
router.get('/assigned', employeeProtectRoute, allowRoles(['employee']), getAssignedTickets);
router.put('/assigned/update', employeeProtectRoute, allowRoles(['employee']), updateAssignedTicket);

// Admins
router.get('/all', employeeProtectRoute, allowRoles(['admin']), getAllTickets);
router.post('/assign', employeeProtectRoute, allowRoles(['admin']), assignTicket);
router.put('/admin/update', employeeProtectRoute, allowRoles(['admin']), updateAnyTicket);

export default router;
