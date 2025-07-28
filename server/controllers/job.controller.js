import { Job } from "../models/job.model.js";
import Company from "../models/company.model.js";


export const postJob = async(req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            gigPay,
            commissionRate,
            salaryType,
            location,
            jobType,
            experience,
            position,
            workArrangement,
            companyId
        } = req.body;
        const userId = req.id;

        // Prepare job data based on salaryType
        const jobData = {
            title,
            description,
            requirements,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            workArrangement,
            created_by: userId,
            salaryType
        };
        if (salaryType === 'fixed') {
            jobData.salary = salary;
        } else if (salaryType === 'gig') {
            jobData.gigPay = gigPay;
        } else if (salaryType === 'commission') {
            jobData.commissionRate = commissionRate;
        }

        const job = await Job.create(jobData);
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create job.",
            error: error.message,
            success: false
        });
    }
}

export const getAllJobs = async(req, res) => {
        try {
            const keyword = req.query.keyword || "";
            // Search by title, description, and company name
            let jobs = [];
            if (keyword) {
                // First, find companies matching the keyword
                const companies = await Company.find({ name: { $regex: keyword, $options: "i" } }).select('_id');
                const companyIds = companies.map(c => c._id);
                const query = {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                        { company: { $in: companyIds } }
                    ]
                };
                jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });
            } else {
                jobs = await Job.find({}).populate({ path: "company" }).sort({ createdAt: -1 });
            }
            if (!jobs) {
                return res.status(404).json({
                    message: "Jobs not found.",
                    success: false
                })
            };
            return res.status(200).json({
                jobs,
                success: true
            })
        } catch (error) {
            console.log(error);
        }
    }
    // jobseeker
export const getJobById = async(req, res) => {
        try {
            const jobId = req.params.id;
            const job = await Job.findById(jobId).populate({
                path: "applications"
            });
            if (!job) {
                return res.status(404).json({
                    message: "Jobs not found.",
                    success: false
                })
            };
            return res.status(200).json({ job, success: true });
        } catch (error) {
            console.log(error);
        }
    }
    // all job created by specific admin
export const getAdminJobs = async(req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteJob = async(req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required' });
    }

    try {
        // Find and delete the job by its ID
        const deletingJob = await Job.findByIdAndDelete(jobId);

        if (!deletingJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const remainingJobs = await Job.find();



        return res.status(200).json({
            message: 'Job deleted successfully',
            remainingJobs,
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        return res.status(500).json({
            message: 'Error deleting the job',
            error: error.message
        });
    }
};