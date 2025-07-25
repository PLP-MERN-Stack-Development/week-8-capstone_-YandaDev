import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  fullname: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('jobseeker', 'recruiter', 'admin').required(),
  phoneNumber: Joi.string().min(5).max(20).optional(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('jobseeker', 'recruiter', 'admin').optional()
});

export const jobSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  requirements: Joi.string().min(1).required(),
  salary: Joi.number().min(0).required(),
  workArrangement: Joi.string().valid('On-site', 'Hybrid', 'Remote').required(),
  experience: Joi.string().allow(''),
  experienceLevel: Joi.string().allow(''),
  location: Joi.string().min(2).required(),
  jobType: Joi.string().min(2).max(50).required(),
  position: Joi.number().min(1).required(),
  companyId: Joi.string().required(),
});

export const companySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
  website: Joi.string().uri().allow(''),
  location: Joi.string().min(2).required(),
  logo: Joi.any().optional()
});
