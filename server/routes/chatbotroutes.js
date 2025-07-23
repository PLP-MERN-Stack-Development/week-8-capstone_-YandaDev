import express from "express";
import { chatbot } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.route("/ask").post(chatbot);

export default router;
