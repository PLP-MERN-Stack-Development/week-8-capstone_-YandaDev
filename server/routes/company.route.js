
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, searchCompanies, deleteCompany } from "../controllers/company.controller.js";
import { logoUpload } from "../middlewares/mutler.js";
import { validateRequest } from "../middlewares/validation.js";
import { companySchema } from "../middlewares/schemas.js";


const router = express.Router();
router.route('/delete').post(isAuthenticated, deleteCompany);
router.route('/search').get(searchCompanies);

// Note the order: isAuthenticated, singleUpload, validateRequest, registerCompany
router.route("/register").post(isAuthenticated, logoUpload, validateRequest(companySchema), registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, logoUpload, validateRequest(companySchema), updateCompany);

export default router;

