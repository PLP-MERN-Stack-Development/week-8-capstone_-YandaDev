import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import Combobox from '../ui/combobox';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import Footer from '../shared/Footer';

const PostJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        workArrangement: '',
        companyId: '',
    });
    // Track the selected company label for Combobox
    const [selectedCompany, setSelectedCompany] = useState({ id: '', name: '' });
    // Fetch recruiter's linked companies from profile (assume available in redux store or fetch on mount)
    const { user } = useSelector((store) => store.auth); // adjust according to your state shape
    const linkedCompanies = user?.profile?.companies || [];
    const selectChangeHandler = (value) => {
        // Find the company in companies or fallback to previous selectedCompany
        let label = '';
        const found = companies.find(c => c._id === value);
        if (found) label = found.name;
        else if (selectedCompany.id === value) label = selectedCompany.name;
        setInput({ ...input, companyId: value });
        setSelectedCompany({ id: value, name: label });
    };
    const workArrangementOptions = ["On-site", "Hybrid", "Remote"];

    const workArrangementChangeHandler = (value) => {
        setInput({ ...input, workArrangement: value });
    };
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector((store) => store.company);
    const [companiesLoading, setCompaniesLoading] = useState(false);

    // Ensure companies are loaded and show loading state
    React.useEffect(() => {
        if (companies.length === 0) {
            setCompaniesLoading(true);
            // Wait a short time to allow useGetAllCompanies to fetch
            const timeout = setTimeout(() => setCompaniesLoading(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [companies]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };



    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error('Please select a company');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // --- Company search workflow ---
    const [companySearch, setCompanySearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const handleCompanySearch = async () => {
        setSearching(true);
        setSearchError('');
        setSearchResults([]);
        try {
            // Use 'q' as the query param to match backend
            const res = await axios.get(`/api/v1/company/search?q=${encodeURIComponent(companySearch)}`);
            let companiesArr = [];
            if (res.data && Array.isArray(res.data.companies)) {
                companiesArr = res.data.companies;
            }
            if (companiesArr.length > 0) {
                setSearchResults(companiesArr);
            } else {
                setSearchResults([]);
                setSearchError('No companies found.');
            }
        } catch (err) {
            setSearchError('Error searching companies.');
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="bg-white min-h-screen ">
            <Navbar />
            <motion.div
                className="flex flex-col items-center justify-center w-full my-5 pt-10"
                initial={ { opacity: 0, y: -20 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.6 } }
            >
                {/* Company Search Section */}
                <div className="w-full max-w-4xl bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-2">
                        <div className="flex-1">
                            <Label>Search for a company by name</Label>
                            <Input
                                type="text"
                                value={companySearch}
                                onChange={e => setCompanySearch(e.target.value)}
                                placeholder="Type company name..."
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <Button type="button" className="bg-blue-500 text-white" onClick={handleCompanySearch} disabled={searching || !companySearch}>
                            {searching ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                    <div className="text-xs text-blue-600 mt-2">Can't find the company? <a href="/admin/companies/create" className="underline">Create a new company profile</a>.</div>
                    {searchError && <div className="text-red-600 text-xs mt-2">{searchError}</div>}
                    {searchResults.length > 0 && (
                        <div className="mt-2">
                            <div className="text-xs text-gray-700 mb-1">Select a company below to populate the form:</div>
                            <ul className="border border-blue-200 rounded-md bg-white max-h-40 overflow-y-auto">
                                {searchResults.map(c => (
                                    <li key={c._id} className="px-3 py-2 cursor-pointer hover:bg-blue-100" onClick={() => {
                                        setInput(prev => ({ ...prev, companyId: c._id }));
                                        setSelectedCompany({ id: c._id, name: c.name });
                                        setCompanySearch(''); // Clear search input so Combobox can show selected
                                        setSearchResults([]);
                                        setSearchError('');
                                    }}>
                                        <span className="font-medium">{c.name}</span> <span className="text-xs text-gray-400">({c.location})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {/* Job Form Section */}
                <form
                    onSubmit={ submitHandler }
                    className="p-8 max-w-4xl w-full bg-white border border-blue-300 shadow-lg rounded-md"
                >
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { duration: 0.7 } }
                    >
                        <div>
                            <Label>
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="title"
                                value={ input.title }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                value={ input.description }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Requirements <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={ input.requirements }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Salary <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="salary"
                                value={ input.salary }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="location"
                                value={ input.location }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Job Type <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={ input.jobType }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Experience Level <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="experience"
                                value={ input.experience }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Work Arrangement <span className="text-red-500">*</span>
                            </Label>
                            <select
                                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={input.workArrangement}
                                onChange={e => workArrangementChangeHandler(e.target.value)}
                            >
                                <option value="" disabled>Select Work Arrangement</option>
                                {workArrangementOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>
                                No of Positions <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="position"
                                value={ input.position }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {/* Company selection: all companies in the database, now with Combobox */}
                        <div>
                            <Label>
                                Company <span className="text-red-500">*</span>
                            </Label>
                            {/* Ensure the selected company is always in the options */}
                            <Combobox
                                options={(() => {
                                    const opts = companies.map(c => ({ value: c._id, label: c.name }));
                                    if (input.companyId && !opts.some(o => o.value === input.companyId)) {
                                        // Always add the selected company if not present
                                        opts.push({ value: selectedCompany.id, label: selectedCompany.name || 'Selected Company' });
                                    }
                                    return opts;
                                })()}
                                value={input.companyId}
                                onChange={selectChangeHandler}
                                placeholder="Search or select a company"
                                key={input.companyId || 'company-combobox'}
                            />
                            {companiesLoading && (
                                <div className="mt-2 text-xs text-blue-600">Loading companies...</div>
                            )}
                        </div>
                    </motion.div>
                    { loading ? (
                        <Button className="w-full my-4 bg-blue-500 text-white">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full my-4 bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                        >
                            Post New Job
                        </Button>
                    ) }
                    { companies.length === 0 && (
                        <p className="text-xs text-red-600 font-bold text-center my-3">
                            *If the company you wish to post a job for does not exist, please create a new company profile first.
                        </p>
                    ) }
                </form>
            </motion.div>
            <Footer />
        </div>
    );
};

export default PostJob;
