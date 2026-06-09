import express from 'express';
import {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getAllTickets
} from '../../controllers/admin/ticket.controller.js';
import { employeeProtectRoute, allowRoles} from "../../middleware/protectRoute.js";

const router = express.Router();

router.post('/',employeeProtectRoute, createTicket);
router.get('/my',employeeProtectRoute, getMyTickets);
router.get('/:id',employeeProtectRoute, getTicketById);
router.put('/:id',employeeProtectRoute, updateTicket);
router.delete('/:id', employeeProtectRoute, deleteTicket);
router.get('/get', employeeProtectRoute, getAllTickets );

export default router;