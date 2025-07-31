import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose
} from '../ui/dialog';
import { Button } from '../ui/button';

const shortlistingStatus = ['Accept', 'Reject'];

const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const ApplicantsTable = () => {
    const { applicants } = useSelector((store) => store.application);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleViewDetails = (applicant) => {
        setSelectedApplicant(applicant);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setSelectedApplicant(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <Table className="bg-white shadow-md rounded-lg">
                <TableCaption className="text-blue-600">A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-blue-500">FullName</TableHead>
                        <TableHead className="text-blue-500">Email</TableHead>
                        <TableHead className="text-blue-500">Contact</TableHead>
                        <TableHead className="text-blue-500">Resume</TableHead>
                        <TableHead className="text-blue-500">Date</TableHead>
                        <TableHead className="text-right text-blue-500">Action</TableHead>
                        <TableHead className="text-blue-500">Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants?.applications?.map((item, index) =>
                        item?.applicant ? (
                            <motion.tr
                                key={item._id}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-blue-50"
                            >
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.resume ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Resume
                                        </a>
                                    ) : item.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item?.applicant?.profile?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item?.applicant?.profile?.resumeOriginalName || 'Resume'}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt ? item.applicant.createdAt.split('T')[0] : 'NA'}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`${status === "Accept" ? "text-green-700" : "text-red-700"} flex w-fit items-center my-2 cursor-pointer`}>
                                                    <span>{status}</span>
                                                </motion.div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(item?.applicant)}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </motion.tr>
                        ) : null
                    )}
                </TableBody>
            </Table>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                {selectedApplicant && (
                    <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white">
                        <DialogTitle className="text-xl font-bold mb-2 text-blue-600">Applicant Details</DialogTitle>
                        <div className="mb-2">
                            <span className="font-semibold">Fullname:</span> {selectedApplicant.fullname}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Email:</span> {selectedApplicant.email}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Contact:</span> {selectedApplicant.phoneNumber}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Bio:</span>
                            <p className="text-gray-700 mt-1">{selectedApplicant?.profile?.bio || 'No bio provided.'}</p>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Skills:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedApplicant?.profile?.skills?.length > 0 ? (
                                    selectedApplicant.profile.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">{skill}</span>
                                    ))
                                ) : (
                                    <span className="text-gray-400">No skills listed.</span>
                                )}
                            </div>
                        </div>
                        <DialogClose asChild>
                            <Button variant="ghost" className="mt-4">Close</Button>
                        </DialogClose>
                    </DialogContent>
                )}
            </Dialog>
        </motion.div>
    );
}

export default ApplicantsTable;
