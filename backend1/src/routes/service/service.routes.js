
import express from "express";
import {
  createService,
  listServices,
  listServiceMenu,
  getServiceBySlug,
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

// GET /api/services/menu    -> lightweight navbar menu data
router.get("/menu", listServiceMenu);

// GET /api/services/slug/:slug -> get one service by slug
router.get("/slug/:slug", getServiceBySlug);

// GET  /api/services/:id    -> get one by Mongo _id
router.get("/:id", getServiceById);

router.patch("/image/:id", employeeProtectRoute, allowRoles(["admin"]), upload.fields([{ name: 'images', maxCount: 5 }]), updateimage);

// PATCH /api/services/:id   -> partial update
router.patch("/:id", employeeProtectRoute, allowRoles(["admin"]), updateService);

// DELETE /api/services/:id  -> delete
router.delete("/:id", employeeProtectRoute, allowRoles(["admin"]), deleteService);

export default router;
