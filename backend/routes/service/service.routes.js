
import express from "express";
import {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService
} from "../../controllers/service/service.controller.js"; // adjust path

const router = express.Router();

// POST /api/services        -> create
router.post("/", createService);

// GET  /api/services        -> list with ?page=&limit=
router.get("/", listServices);

// GET  /api/services/:id    -> get one by Mongo _id
router.get("/:id", getServiceById);

// PATCH /api/services/:id   -> partial update
router.patch("/:id", updateService);

// DELETE /api/services/:id  -> delete
router.delete("/:id", deleteService);

export default router;
