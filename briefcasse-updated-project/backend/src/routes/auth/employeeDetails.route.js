import express from "express";
import {
  upsertPersonalDetails,
  getMyPersonalDetails,
} from "../../controllers/auth/employeeDetail.controller.js";

import { employeeProtectRoute,} from "../../middleware/protectRoute.js";
import { wrapAsync } from "../../utils/wrapAsync.js";

const router = express.Router();

router.post("/personal-details", employeeProtectRoute, upsertPersonalDetails);
router.get("/personal-details/me", employeeProtectRoute, getMyPersonalDetails);

export default router;