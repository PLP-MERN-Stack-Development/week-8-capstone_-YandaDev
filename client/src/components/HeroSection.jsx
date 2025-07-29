import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { toast } from 'sonner';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (e) => {
        e.preventDefault();
        dispatch(setSearchedQuery(query));
        navigate('/browse');
    };

    const handleNavigation = () => {
        toast.success('Please Login into Recruiter AAccount  ')
        navigate('/signup')
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden pt-24 pb-20 bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white px-4 sm:px-8 flex flex-col items-center justify-center shadow-2xl"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDIwMHYyMDBIMHoiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

            <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-10 sm:mb-12 text-center tracking-tight user-select text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg max-w-3xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
            >
                Discover Your Next Opportunity with TechJobHub
            </motion.h1>

            <motion.p
                className="text-lg sm:text-xl text-gray-300 mb-12 sm:mb-16 max-w-xl mx-auto leading-relaxed text-center user-select drop-shadow-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
            >
                Connect with top tech companies and startups hiring in software development, cloud, AI, data, and more. Find roles that match your skills, goals, and tech stack — your next breakthrough starts here.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-8 mb-14 w-full items-center">
                <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 px-8 py-5 sm:px-12 sm:py-6 rounded-full flex items-center justify-center text-base sm:text-xl font-semibold shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={() => navigate('/jobs')}
                >
                    🔍 Find a Job
                </Button>
                <Button
                    onClick={handleNavigation}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-blue-400 text-white hover:bg-gray-900 bg-transparent px-8 py-5 sm:px-12 sm:py-6 rounded-full flex items-center justify-center text-base sm:text-xl font-semibold cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105"
                >
                    💼 Post Jobs
                </Button>
            </div>

            <motion.div
                className="flex w-full sm:w-[80%] lg:w-[50%] shadow-xl border border-blue-500 pl-3 pr-2 py-3 rounded-full items-center gap-3 mx-auto bg-[#001636] bg-opacity-95"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <Input
                    type="text"
                    value={query}
                    placeholder="Search by title, skill or company"
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-3 outline-none border-none bg-transparent text-white placeholder-gray-400 rounded-full text-base sm:text-lg focus:ring-2 focus:ring-blue-500"
                />

                <Button
                    onClick={searchJobHandler}
                    className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 px-6 py-3 flex items-center text-base sm:text-lg font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default HeroSection;
