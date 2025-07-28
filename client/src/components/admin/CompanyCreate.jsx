import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { setUser } from '@/redux/authSlice';
import Footer from '../shared/Footer';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        location: '',
        website: '',
    });
    const [logo, setLogo] = useState(null);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (logo) {
                formData.append('logo', logo);
            }
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                // Update user state with the latest user object (must be returned from backend)
                if (res.data.user) {
                    dispatch(setUser(res.data.user));
                }
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error("Failed to create company. Please try again.");
        }
    };

    return (
        <motion.div
            className="bg-white min-h-screen flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 p-5 flex-1">
                <div className="my-10">
                    <h1 className="font-bold text-2xl text-blue-600">Your Company Name</h1>
                    <p className="text-gray-500">What would you like to give your company name? You can change this later.</p>
                </div>

                <Label className="text-gray-700">Company Name</Label>
                <Input
                    type="text"
                    name="name"
                    className="my-2 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:border-blue-400"
                    placeholder="JobHunt, Microsoft etc."
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />
                <Label className="text-gray-700 mt-4">Description</Label>
                <Input
                    type="text"
                    name="description"
                    className="my-2 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:border-blue-400"
                    placeholder="Describe your company"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                />
                <Label className="text-gray-700 mt-4">Location</Label>
                <Input
                    type="text"
                    name="location"
                    className="my-2 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:border-blue-400"
                    placeholder="Location (e.g. Nairobi, Kenya)"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                />
                <Label className="text-gray-700 mt-4">Website</Label>
                <Input
                    type="url"
                    name="website"
                    className="my-2 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:border-blue-400"
                    placeholder="https://yourcompany.com"
                    value={form.website}
                    onChange={e => setForm({ ...form, website: e.target.value })}
                    required
                />
                <Label className="text-gray-700 mt-4">Company Logo</Label>
                <Input
                    type="file"
                    name="logo"
                    accept=".png,.jpg,.jpeg,.svg"
                    className="my-2 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:border-blue-400"
                    onChange={e => setLogo(e.target.files[0])}
                />

                <Button
                    onClick={registerNewCompany}
                    className="w-full mt-6 bg-blue-600 text-white rounded-md py-2 shadow-md hover:bg-blue-500 transition duration-200"
                >
                    Create Company
                </Button>
            </div>
            <Footer />
        </motion.div>
    );
};

export default CompanyCreate;