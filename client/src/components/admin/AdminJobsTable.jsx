import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Delete, Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {
    const dispatch = useDispatch()
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();


    const handleDeleteJob = async (jobId) => {
        try {
            if (!jobId) {
                toast.error('Job ID is missing');
                return;
            }
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${JOB_API_END_POINT}/delete`, { jobId });

            // Update Redux state
            dispatch(setAllJobs(response.data.remainingJobs));

            // Trigger re-filtering
            setFilterJobs(response.data.remainingJobs);

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error(error.response?.data?.message || 'Error deleting the job');
        }
    };


    useEffect(() => {
        setFilterJobs(allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
        }));
    }, [allAdminJobs, searchJobByText]);


    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.5 } }
            className="w-full"
        >
            <div className="border border-blue-300 rounded-xl bg-white shadow-md p-5 transition-all duration-300 w-full">
                <Table className="w-full block md:table">
                <TableHeader className="hidden md:table-header-group">
                    <TableRow>
                        <TableHead className="py-4 px-6">Company Name</TableHead>
                        <TableHead className="py-4 px-6">Role</TableHead>
                        <TableHead className="py-4 px-6">Date</TableHead>
                        <TableHead className="py-4 px-6 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { filterJobs?.map((job) => (
                        <motion.tr
                            key={ job._id }
                            initial={ { opacity: 0 } }
                            animate={ { opacity: 1 } }
                            transition={ { duration: 0.3 } }
                            className="hover:bg-blue-50 border-b border-gray-200 block md:table-row md:mb-0"
                        >
                            <TableCell className="py-4 px-6 whitespace-nowrap block md:table-cell">
                                <span className="font-semibold md:hidden">Company Name: </span>{ job?.company?.name }
                            </TableCell>
                            <TableCell className="py-4 px-6 whitespace-nowrap block md:table-cell">
                                <span className="font-semibold md:hidden">Role: </span>{ job?.title }
                            </TableCell>
                            <TableCell className="py-4 px-6 whitespace-nowrap block md:table-cell">
                                <span className="font-semibold md:hidden">Date: </span>{ job?.createdAt.split("T")[0] }
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right cursor-pointer block md:table-cell">
                                <span className="font-semibold md:hidden">Action: </span>
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="text-blue-600 hover:text-blue-500" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32 bg-white shadow-md rounded-md">
                                        <div
                                            onClick={ () => navigate(`/admin/jobs/${job._id}/update`) }
                                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-500 p-2"
                                        >
                                            <Edit2 className="w-4" />
                                            <span>Edit</span>
                                        </div>
                                        <div
                                            onClick={ () => navigate(`/admin/jobs/${job._id}/applicants`) }
                                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-500 p-2"
                                        >
                                            <Eye className="w-4" />
                                            <span>Applicants</span>
                                        </div>
                                        <div
                                            onClick={ () => handleDeleteJob(job?._id) }
                                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-500 p-2"
                                        >
                                            <Delete className="w-4" />
                                            <span>Delete</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </motion.tr>
                    )) }
                </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}

export default AdminJobsTable;
