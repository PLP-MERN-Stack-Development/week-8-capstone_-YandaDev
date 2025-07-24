import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // State to control filter card visibility

    useEffect(() => {
        if (searchedQuery) {
            const queryWords = searchedQuery.toLowerCase().split(" ");
            const filtered = allJobs.filter(job => {
                const searchFields = [
                    job.title,
                    job.description,
                    job.requirements?.join(" "), // Join requirements array into a single string
                    job.location
                ];
                return queryWords.some(word =>
                    searchFields.some(field => field?.toLowerCase().includes(word))
                );
            });
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#00040A] to-[#001636]">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-20">
                {/* Horizontal Filter Bar */}
                <div className="w-full mb-8">
                    <FilterCard />
                </div>
                {/* Main Job List Section */}
                <div className="">
                    <motion.div
                        className="grid grid-cols-1 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <motion.div
                                    key={job?._id}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 20
                                    }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))
                        ) : (
                            <span className="text-blue-400 font-bold">No jobs found</span>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
