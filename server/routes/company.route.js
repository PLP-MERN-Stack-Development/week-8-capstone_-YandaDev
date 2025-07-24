import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import { validateRequest } from "../middlewares/validation.js";
import { companySchema } from "../middlewares/schemas.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, validateRequest(companySchema), registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, validateRequest(companySchema), updateCompany);

export default router;

