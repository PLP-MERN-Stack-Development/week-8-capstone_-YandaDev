import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import Footer from '../shared/Footer';

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <motion.div className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Navbar />
                <div className="flex justify-center items-start flex-1 pb-8 md:pb-8 lg:pb-6 xl:pb-4 mt-20 sm:mt-8 md:mt-10">
                  <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between my-5 mt-6 sm:mt-8 md:mt-10">
                        <Input
                            className="w-fit p-2 border border-gray-300 rounded-md shadow-sm transition-all duration-300 focus:border-blue-400"
                            placeholder="Filter by name"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            onClick={() => navigate("/admin/companies/create")}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            New Company
                        </Button>
                    </div>
                    <CompaniesTable />
                  </div>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default Companies;
