import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer';

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAllAdminJobs();

  useEffect(() => {
    // Update the search term in Redux whenever input changes
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <motion.div
        className="flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        <div className="flex justify-center items-start flex-1 pb-8 md:pb-8 lg:pb-6 xl:pb-4 mt-20 sm:mt-8 md:mt-10">
          <div className='w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-2 sm:px-4 md:px-6 lg:px-8'>
            <motion.div
              className='flex items-center justify-between my-5 mt-6 sm:mt-8 md:mt-10'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                className="w-fit"
                placeholder="Filter by name, role"
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                className='bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300'
                onClick={() => navigate("/admin/jobs/create")}
              >
                New Job
              </Button>
            </motion.div>
            <AdminJobsTable />
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default AdminJobs;
