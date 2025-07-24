import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import { Client, Storage, Permission, Role } from "node-appwrite";

export const registerCompany = async(req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
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


// delete a company by admin 

export const deleteCompany = async(req, res) => {
    const { compmanyId } = req.body;
    const userId = req.id

    if (!userId) {
        return res.status(400).json({
            message: "User is not authneticated.",
            success: false
        });
    }
    if (!compmanyId) {
        return res.status(400).json({
            message: "User is not authneticated.",
            success: false
        });
    }

}