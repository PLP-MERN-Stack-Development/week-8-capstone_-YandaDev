import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import Footer from './shared/Footer';

const Browse = () => {
    const jobsLoading = useGetAllJobs();
    const { allJobs, searchJobByText } = useSelector(store => store.job);  // Assuming allJobs is an array
    const dispatch = useDispatch();

    // Removed useEffect cleanup that reset the search query on unmount

    // Fuzzy matching utility
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

    // Filter jobs by searchJobByText
    const searchText = (searchJobByText || '').toLowerCase().trim();
    let filteredJobs = allJobs;
    if (searchText.length > 0 && allJobs.length > 0) {
        const searchWords = searchText.split(' ').filter(Boolean);
        filteredJobs = allJobs.filter(job => {
            const fields = [
                job.title?.toLowerCase(),
                job.description?.toLowerCase(),
                job.location?.toLowerCase(),
                job.company?.name?.toLowerCase(),
                Array.isArray(job.techStack) ? job.techStack.join(' ').toLowerCase() : job.techStack?.toLowerCase()
            ];
            return searchWords.some(word =>
                fields.some(field => {
                    if (!field) return false;
                    if (field.includes(word)) return true;
                    return field.split(/\W+/).some(fw => levenshtein(fw, word) <= 2);
                })
            );
        });
    }

    return (
        <>
            <div className="bg-gray-900 min-h-screen text-white bg-gradient-to-br from-[#00040A] to-[#001636]">
                <Navbar />
                <div className='max-w-7xl mx-auto pt-16'>
                    <h1 className='font-bold text-xl my-10'>
                        Search Results ({ filteredJobs.length })
                    </h1>
                    { jobsLoading || allJobs.length === 0 ? (
                        <p className="text-lg text-gray-400">Loading jobs...</p>
                    ) : searchText.length > 0 ? (
                        filteredJobs.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                                { filteredJobs.map((job) => (
                                    <Job key={ job._id } job={ job } />
                                )) }
                            </div>
                        ) : (
                            <p className="text-lg text-gray-400">No jobs found.</p>
                        )
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                            { allJobs.length > 0 ? (
                                allJobs.map((job) => (
                                    <Job key={ job._id } job={ job } />
                                ))
                            ) : (
                                <p>No jobs found.</p>
                            ) }
                        </div>
                    ) }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Browse;
