import express from "express";
import { login, logout, register, savedJobs, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import { validateRequest } from "../middlewares/validation.js";
import { userRegisterSchema, userLoginSchema } from "../middlewares/schemas.js";

const router = express.Router();

router.route("/signup").post(singleUpload, validateRequest(userRegisterSchema), register);
router.route("/login").post(validateRequest(userLoginSchema), login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/savedjob").post(isAuthenticated, savedJobs)

export default router;