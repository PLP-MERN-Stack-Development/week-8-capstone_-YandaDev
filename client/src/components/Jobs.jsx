import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    // Robust normalization: lowercase, replace hyphens with spaces, collapse spaces, trim
    const normalize = str => (str || '').toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const { allJobs, activeFilters } = useSelector(store => store.job);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // State to control filter card visibility

    // Utility for fuzzy matching (simple Levenshtein distance)
    function levenshtein(a, b) {
        if (!a || !b) return Math.max(a?.length || 0, b?.length || 0);
        const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[a.length][b.length];
    }

    // ...existing code...
    useEffect(() => {
        if (!activeFilters) {
            setFilteredJobs(allJobs);
            return;
        }
        let filtered = allJobs;
        const {
            Location = [],
            JobTitle = [],
            DatePosted = [],
            JobType = [],
            ExperienceLevel = [],
            WorkArrangement = []
        } = activeFilters;
        if (
            Location.length > 0 ||
            JobTitle.length > 0 ||
            DatePosted.length > 0 ||
            JobType.length > 0 ||
            ExperienceLevel.length > 0 ||
            WorkArrangement.length > 0
        ) {
            filtered = allJobs.filter(job => {
                let matches = true;
                if (Location.length > 0) {
                    matches = matches && Location.some(loc => (job.location && normalize(job.location).includes(normalize(loc))));
                }
                if (JobTitle.length > 0) {
                    matches = matches && JobTitle.some(title => (job.title && normalize(job.title).includes(normalize(title))));
                }
                if (JobType.length > 0) {
                    matches = matches && JobType.some(type => (job.jobType && normalize(job.jobType).includes(normalize(type))));
                }
                if (ExperienceLevel.length > 0) {
                    matches = matches && ExperienceLevel.some(exp => (job.experience && normalize(job.experience).includes(normalize(exp))));
                }
                if (WorkArrangement.length > 0) {
                    matches = matches && WorkArrangement.some(arr => (job.workArrangement && normalize(job.workArrangement).includes(normalize(arr))));
                }
                // DatePosted filter (if implemented)
                // ...implement date logic if needed...
                return matches;
            });
        }
        setFilteredJobs(filtered);
    }, [allJobs, activeFilters]);
    // ...existing code...
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
}

export default Jobs;
