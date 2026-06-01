
import express from "express";
import {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService,
  updateimage
} from "../../controllers/service/service.controller.js"; // adjust path
import { upload } from '../../helpers/cloudinary.js';
import { employeeProtectRoute, allowRoles } from "../../middleware/protectRoute.js";

const router = express.Router();

// POST /api/services        -> create
router.post("/", employeeProtectRoute, allowRoles(["admin"]), createService);

// GET  /api/services        -> list with ?page=&limit=
router.get("/", listServices);

// GET  /api/services/:id    -> get one by Mongo _id
router.get("/:id", getServiceById);

// PATCH /api/services/:id   -> partial update
router.patch("/:id", employeeProtectRoute, allowRoles(["admin"]), updateService);
router.patch("/image/:id", employeeProtectRoute, allowRoles(["admin"]), upload.fields([{ name: 'images', maxCount: 5 }]), updateimage);

// DELETE /api/services/:id  -> delete
router.delete("/:id", employeeProtectRoute, allowRoles(["admin"]), deleteService);

export default router;
