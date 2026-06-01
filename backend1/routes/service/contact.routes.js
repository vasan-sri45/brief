import express from "express";
import { sendContactMail } from "../../controllers/service/contact.controler.js";

const router = express.Router();

router.post("/contact", sendContactMail);

export default router;
