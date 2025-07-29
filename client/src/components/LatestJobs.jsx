import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const LatestJobs = () => {
    const { allJobs, searchJobByText } = useSelector((store) => store.job);

    // Ensure allJobs is an array
    const jobsList = Array.isArray(allJobs) ? allJobs : [];

    // Fuzzy matching utility (copied from Browse.jsx)
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

    // Always show the latest 6 jobs, unfiltered by search
    const filteredJobs = jobsList;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="max-w-7xl mx-auto my-20 px-4">
            {/* Title with Motion */ }
            <motion.h1
                className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600"
                initial={ { opacity: 0, y: -50 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.5 } }
                aria-label="Latest and Top Job Openings"
            >
                <span>Latest & Top</span> Job Openings
            </motion.h1>

            {/* Job Cards Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredJobs.length === 0 ? (
                    <motion.span
                        className="text-center text-lg text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        No Jobs Available
                    </motion.span>
                ) : (
                    filteredJobs.slice(0, 6).map((job) => (
                        <motion.div
                            key={job._id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LatestJobCards job={job} />
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* View More Jobs Button */}
            <div className="flex justify-center mt-12">
                <a
                    href="/jobs"
                    className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-full px-8 py-4 text-base sm:text-lg shadow-lg hover:from-blue-500 hover:to-purple-600 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    View More Jobs
                </a>
            </div>
        </div>
    );
};

export default LatestJobs;
