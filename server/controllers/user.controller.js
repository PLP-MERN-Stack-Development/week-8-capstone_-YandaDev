import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { Client, Storage, Permission, Role } from "node-appwrite";

export const register = async(req, res) => {
    try {
        const { fullname, email, password, role, phoneNumber, companyId } = req.body;

        console.log(fullname, email, password, role);

        // Check if any required field is missing
        if (!fullname || !email || !password || !role || !phoneNumber) {
            return res.status(400).json({
                message: "Required All Fileds",
                success: false,
            });
        }


        let profilePhotoUrl = null;
        const file = req.file;
        console.log('DEBUG: req.file in register:', file);
        if (file) {
            try {
                // Direct REST API upload using axios and form-data
                const axios = (await import('axios')).default;
                const FormData = (await import('form-data')).default;
                const form = new FormData();
                form.append('fileId', 'unique()');
                form.append('file', file.buffer, file.originalname);
                // Permissions: allow any user to read/update/delete
                form.append('permissions[]', 'read("user:all")');
                form.append('permissions[]', 'update("user:all")');
                form.append('permissions[]', 'delete("user:all")');

                const response = await axios.post(
                    `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files`,
                    form,
                    {
                        headers: {
                            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
                            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
                            ...form.getHeaders()
                        }
                    }
                );
                const appwriteFile = response.data;
                profilePhotoUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
            } catch (error) {
                console.error('Appwrite upload error:', error?.response?.data || error);
                profilePhotoUrl = null;
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating user with profilePhoto:', profilePhotoUrl);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
            profile: {
                profilePhoto: profilePhotoUrl,
                company: companyId || undefined,
            },
        });

        console.log('User created successfully with profile:', {
            id: newUser._id,
            profilePhoto: newUser.profile.profilePhoto
        });

        // Populate companies for response
        const populatedUser = await User.findById(newUser._id).populate('profile.companies');
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: populatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
            false: error
        });
    }
};

export const login = async(req, res) => {
    try {
        console.log("Request body received:", req.body);

        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            console.log("Validation failed: Missing fields");
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        console.log("Checking user existence");
        let user = await User.findOne({ email }).populate('profile.companies');
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        console.log("Comparing passwords");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password mismatch for email:", email);
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (role !== user.role) {
            console.log("Role mismatch for user:", email);
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }


        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        console.log("Returning success response");

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false, // Allow JavaScript access for development
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production', // Only secure in production
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true,
            });

    } catch (error) {
        console.error("Error in login route:", {
            message: error.message,
            stack: error.stack,
        });

        // Send detailed error in response
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message, // Add error details here
            success: false,
        });
    }
};


export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, companyId } = req.body;
        const file = req.file;
        let resumeFileUrl = null;
        if (file) {
            try {
                // Direct REST API upload using axios and form-data
                const axios = (await import('axios')).default;
                const FormData = (await import('form-data')).default;
                const form = new FormData();
                form.append('fileId', 'unique()');
                form.append('file', file.buffer, file.originalname);
                // Permissions: allow any user to read/update/delete
                form.append('permissions[]', 'read("user:all")');
                form.append('permissions[]', 'update("user:all")');
                form.append('permissions[]', 'delete("user:all")');

                const response = await axios.post(
                    `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files`,
                    form,
                    {
                        headers: {
                            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
                            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
                            ...form.getHeaders()
                        }
                    }
                );
                const appwriteFile = response.data;
                resumeFileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
            } catch (error) {
                console.error('Appwrite resume upload error:', error?.response?.data || error);
                return res.status(500).json({
                    message: 'Error uploading resume to Appwrite.',
                    success: false
                });
            }
        }


        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        // ...existing code...
        // Appwrite upload for resume (PDF, DOC, etc.)
        if (file) {
            try {
                // Direct REST API upload using axios and form-data
                const axios = (await import('axios')).default;
                const FormData = (await import('form-data')).default;
                const form = new FormData();
                form.append('fileId', 'unique()');
                form.append('file', file.buffer, file.originalname);
                // Permissions: allow any user to read/update/delete
                form.append('permissions[]', 'read("user:all")');
                form.append('permissions[]', 'update("user:all")');
                form.append('permissions[]', 'delete("user:all")');

                const response = await axios.post(
                    `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files`,
                    form,
                    {
                        headers: {
                            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
                            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
                            ...form.getHeaders()
                        }
                    }
                );
                const appwriteFile = response.data;
                resumeFileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
            } catch (error) {
                console.error('Appwrite resume upload error:', error?.response?.data || error);
                return res.status(500).json({
                    message: 'Error uploading resume to Appwrite.',
                    success: false
                });
            }
        }
        // Populate the updated user before returning response
        const updatedUser = await User.findOne({ email }).populate('profile.companies');
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const savedJobs = async(req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        let user = await User.findById(userId)
        if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }
    if (user.profile.savedJobs.includes(jobId)) {
        return res.status(400).json({
            message: "Job is already saved",
            success: false
        });
    }

        user.profile.savedJobs.push(jobId);
        await user.save()

        await user.populate('profile.savedJobs');
        return res.status(200).json({
            user,
            message: "Job saved successfully",
            success: true,
            savedJobs: user.profile.savedJobs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
            success: false
        });

    }
}

// Get the company linked to the current recruiter
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate('profile.companies');
    if (!user || !user.profile.company) {
      return res.status(404).json({ message: 'No company linked', success: false });
    }
    return res.status(200).json({ company: user.profile.company, success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching company', success: false });
  }
};