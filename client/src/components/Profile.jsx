import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { motion } from 'framer-motion';
import SavedJobsTable from './SavedJobsTable';
import Footer from './shared/Footer';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);

    return (
        <>
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                transition={ { duration: 0.5 } }
                className="pb-4 bg-gradient-to-br from-[#00040A] to-[#001636] text-gray-300"
            >
                <Navbar />
                {/* Main container with padding adjustment for navbar */ }
                <div className="pt-20 max-w-4xl mx-auto px-6">
                    {/* Profile Information - Avatar and Edit above, skills aligned right with bio */}
                    <div className="bg-gray-900 border border-blue-900 rounded-3xl shadow-xl p-8 my-8 max-w-3xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                            <div className="flex flex-col items-center w-full md:items-start md:w-1/4">
                                <div className="flex flex-col items-center w-full">
                                    <Avatar className="h-24 w-24 shadow-lg mb-2">
                                        <AvatarImage src={user?.profile?.profilePhoto ? user?.profile?.profilePhoto : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s'} alt="profile" />
                                    </Avatar>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-2 shadow-md mt-4"
                                        aria-label="Edit Profile"
                                    >
                                        <Pen className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <h1 className="font-bold text-2xl text-white mb-1">{user?.fullname}</h1>
                                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line min-h-[48px]">
                                    {user?.profile?.bio ? user.profile.bio : <span className="text-gray-500">NA</span>}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="text-blue-400" />
                                        <span className="text-gray-200 text-sm">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Contact className="text-blue-400" />
                                        <span className="text-gray-200 text-sm">{user?.phoneNumber}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-white text-lg font-semibold mb-3">Skills</h2>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0 ? (
                                            user.profile.skills.map((item, index) => (
                                                <Badge key={index} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow">
                                                    {item}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">NA</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Label className="text-md font-bold text-white">Resume</Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        {user?.profile?.resume ? (
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={user.profile.resume}
                                                className="text-blue-400 hover:underline text-sm font-semibold"
                                            >
                                                Resume
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">NA</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applied Jobs Section */ }
                    <div className="bg-gray-800 rounded-2xl shadow-md p-6 my-6">
                        <h1 className="font-bold text-lg text-white mb-4">Applied Jobs</h1>
                        <AppliedJobTable />
                    </div>

                    {/* Saved Jobs Section */ }
                    <div className="bg-gray-800 rounded-2xl shadow-md p-6 my-6">
                        <h1 className="font-bold text-lg text-white mb-4">Saved Jobs</h1>
                        <SavedJobsTable />
                    </div>
                </div>

                {/* Update Profile Dialog */ }
                <UpdateProfileDialog open={ open } setOpen={ setOpen } />
            </motion.div>
            <Footer />
        </>
    );
};

export default Profile;
