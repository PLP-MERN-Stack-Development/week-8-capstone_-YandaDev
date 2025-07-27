import Company from "../models/company.model.js";
// Data consistency: Remove company link from recruiters and jobs if company is deleted
export const deleteCompany = async(req, res) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found', success: false });
    }
    // Remove company from recruiters
    await import('../models/user.model.js').then(m => m.User.updateMany({ 'profile.company': companyId }, { $unset: { 'profile.company': '' } }));
    // Optionally, remove or update jobs linked to this company
    await import('../models/job.model.js').then(m => m.Job.updateMany({ company: companyId }, { $unset: { company: '' } }));
    await company.deleteOne();
    return res.status(200).json({ message: 'Company deleted and links removed', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting company', success: false });
  }
};
// Search companies by name or website
export const searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    console.log('[Company Search] Query:', q);
    if (!q) {
      return res.status(400).json({ message: 'Query required', success: false });
    }
    const companies = await Company.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { website: { $regex: q, $options: 'i' } }
      ]
    });
    console.log('[Company Search] Found:', companies.length, 'companies');
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error('[Company Search] Error:', error);
    return res.status(500).json({ message: 'Error searching companies', success: false });
  }
};
import getDataUri from "../utils/datauri.js";
import { Client, Storage, Permission, Role } from "node-appwrite";

export const registerCompany = async(req, res) => {
    try {
        const { name, description, website, location } = req.body;
        if (!name || !description || !location) {
            return res.status(400).json({
                message: "Name, description, and location are required.",
                success: false
            });
        }
        let company = await Company.findOne({ name });
        // If company exists, link recruiter to it (add to companies array if not present)
        if (company) {
            const user = req.user || (await import('../models/user.model.js').then(m => m.User.findById(req.id)));
            if (user) {
                if (!user.profile.companies) user.profile.companies = [];
                if (!user.profile.companies.some(id => id.equals(company._id))) {
                    user.profile.companies.push(company._id);
                    await user.save();
                }
            }
            return res.status(200).json({
                message: "Company already exists. Linked recruiter to company.",
                company,
                success: true
            });
        }

        // Handle logo upload
        let logoUrl = '';
        if (req.file) {
            try {
                const client = new Client()
                    .setEndpoint(process.env.APPWRITE_ENDPOINT)
                    .setProject(process.env.APPWRITE_PROJECT_ID)
                    .setKey(process.env.APPWRITE_API_KEY);
                const storage = new Storage(client);
                const appwriteFile = await storage.createFile(
                    process.env.APPWRITE_BUCKET_ID,
                    'unique()',
                    req.file.buffer,
                    [
                        Permission.read(Role.user('any')),
                        Permission.update(Role.user('any')),
                        Permission.delete(Role.user('any'))
                    ]
                );
                logoUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
            } catch (error) {
                console.error('Appwrite logo upload error:', error);
            }
        }

        company = await Company.create({
            name,
            description,
            website: website || '',
            location,
            logo: logoUrl
        });

        // Link recruiter to new company (add to companies array)
        const user = req.user || (await import('../models/user.model.js').then(m => m.User.findById(req.id)));
        if (user) {
            if (!user.profile.companies) user.profile.companies = [];
            user.profile.companies.push(company._id);
            await user.save();
        }

        return res.status(201).json({
            message: "Company registered successfully and recruiter linked.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            success: false
        });
    }
}

export const getCompany = async(req, res) => {
        try {
            const userId = req.id; // logged in user id
            const companies = await Company.find({ userId });
            if (!companies) {
                return res.status(404).json({
                    message: "Companies not found.",
                    success: false
                })
            }
            return res.status(200).json({
                companies,
                success: true
            })
        } catch (error) {
            console.log(error);
        }
    }
    // get company by id

export const getCompanyById = async(req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async(req, res) => {
    try {
        console.log('---[Company Update Debug]---');
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        if (req.file) {
            console.log('File received:', req.file);
        }

        const { name, description, website, location } = req.body;
        let updateData = { name, description, website, location };

        let logoUrl = null;
        if (req.file) {
            try {
                const client = new Client()
                    .setEndpoint(process.env.APPWRITE_ENDPOINT)
                    .setProject(process.env.APPWRITE_PROJECT_ID)
                    .setKey(process.env.APPWRITE_API_KEY);
                const storage = new Storage(client);
                const appwriteFile = await storage.createFile(
                    process.env.APPWRITE_BUCKET_ID,
                    'unique()',
                    req.file.buffer,
                    [
                        Permission.read(Role.user('any')),
                        Permission.update(Role.user('any')),
                        Permission.delete(Role.user('any'))
                    ]
                );
                logoUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
                updateData.logo = logoUrl;
            } catch (error) {
                console.error('Appwrite logo upload error:', error);
            }
        }

        console.log('Update data:', updateData);
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log('MongoDB update result:', company);

        if (!company) {
            console.log('Company not found for update.');
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company
        });
    } catch (error) {
        console.error('General update error:', error);
        return res.status(500).json({
            message: "An error occurred while updating company information.",
            success: false
        });
    }
};
