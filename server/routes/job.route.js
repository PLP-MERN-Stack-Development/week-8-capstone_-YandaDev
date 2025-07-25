import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteJob, getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import { validateRequest } from "../middlewares/validation.js";
import { jobSchema } from "../middlewares/schemas.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, validateRequest(jobSchema), postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route('/delete').post(deleteJob)

export default router;