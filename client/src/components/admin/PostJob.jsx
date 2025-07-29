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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import Footer from '../shared/Footer';
function PostJob() {
    // --- State and hooks ---
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        payType: '',
        minSalary: '',
        maxSalary: '',
        currency: 'USD',
        payPeriod: 'per month',
        gigDescription: '',
        commissionDetails: '',
        location: '',
        workArrangement: '',
        position: '',
        companyId: '',
        experience: '',
    });
    const [selectedCompany, setSelectedCompany] = useState({ id: '', name: '' });
    useGetAllCompanies();
    const companies = useSelector(state => state.company.companies);
    const companiesLoading = false; // Optionally, add loading state to Redux if needed
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const workArrangementOptions = [
        'Remote',
        'On-site',
        'Hybrid',
        'Contract',
        'Internship',
        'Part-time',
        'Full-time',
    ];
    const changeEventHandler = e => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };
    const handlePayTypeChange = e => {
        const value = e.target.value;
        setInput(prev => ({ ...prev, payType: value }));
    };
    const selectChangeHandler = value => {
        setInput(prev => ({ ...prev, companyId: value }));
        const company = companies.find(c => c._id === value);
        setSelectedCompany({ id: value, name: company ? company.name : '' });
    };
    // ...existing code...
    // Unified submitHandler for flexible salary model
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error('Please select a company');
            return;
        }
        if (!input.payType) {
            toast.error('Please select a pay type');
            return;
        }
        if (!input.description || input.description.length < 10) {
            toast.error('Description must be at least 10 characters long');
            return;
        }
        // Prepare salary fields for backend
        let salaryPayload = {};
        let salaryType = '';
        if (input.payType === 'Fixed Range Salary') {
            salaryType = 'fixed';
            if (!input.minSalary && !input.maxSalary) {
                toast.error('Please provide at least a minimum or maximum salary');
                return;
            }
            if (input.minSalary && input.maxSalary && Number(input.minSalary) > Number(input.maxSalary)) {
                toast.error('Minimum salary cannot be greater than maximum salary');
                return;
            }
            salaryPayload = {
                salary: Number(input.minSalary || input.maxSalary),
                salaryType,
            };
        } else if (input.payType === 'Task/Gig-Based') {
            salaryType = 'gig';
            if (!input.gigDescription) {
                toast.error('Please provide a description for gig/task-based pay');
                return;
            }
            salaryPayload = {
                gigPay: input.gigDescription,
                salaryType,
            };
        } else if (input.payType === 'Commission Only') {
            salaryType = 'commission';
            if (!input.commissionDetails) {
                toast.error('Please provide commission details');
                return;
            }
            // Extract number from commissionDetails string (e.g. 'commission is 15% per sale')
            const match = input.commissionDetails.match(/([0-9]+(\.[0-9]+)?)/);
            let commissionRate = match ? parseFloat(match[1]) : NaN;
            if (isNaN(commissionRate)) {
                toast.error('Please enter a valid commission percentage (e.g. 15 or 15%)');
                return;
            }
            salaryPayload = {
                commissionRate,
                salaryType,
            };
        }
        try {
            setLoading(true);
            // Remove payType, minSalary, maxSalary, currency, payPeriod, gigDescription, commissionDetails from payload
            const {
                payType,
                minSalary,
                maxSalary,
                currency,
                payPeriod,
                gigDescription,
                commissionDetails,
                ...inputPayload
            } = input;
            // For gig-based jobs, ensure salary is not sent at all and position is a number
            let finalPayload = { ...inputPayload, ...salaryPayload };
            // Remove all salary fields not relevant to the selected salaryType
            if (finalPayload.salaryType === 'fixed') {
                delete finalPayload.gigPay;
                delete finalPayload.commissionRate;
            } else if (finalPayload.salaryType === 'gig') {
                delete finalPayload.salary;
                delete finalPayload.commissionRate;
            } else if (finalPayload.salaryType === 'commission') {
                delete finalPayload.salary;
                delete finalPayload.gigPay;
            }
            // Ensure position is a number
            if (typeof finalPayload.position === 'string') {
                finalPayload.position = Number(finalPayload.position);
            }
            // Remove duplicate keys by prioritizing salaryPayload values
            if (salaryPayload.salaryType) finalPayload.salaryType = salaryPayload.salaryType;
            if (salaryPayload.gigPay) finalPayload.gigPay = salaryPayload.gigPay;
            if (salaryPayload.salary) finalPayload.salary = salaryPayload.salary;
            if (salaryPayload.commissionRate) finalPayload.commissionRate = salaryPayload.commissionRate;
            console.log('Job post payload:', finalPayload);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, finalPayload, {
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
                <div className="w-full max-w-4xl bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 mt-8 md:mt-12">
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
                            <ReactQuill
                                theme="snow"
                                value={input.description}
                                onChange={value => setInput({ ...input, description: value })}
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter job description..."
                            />
                        </div>
                        <div>
                            <Label>
                                Requirements <span className="text-red-500">*</span>
                            </Label>
                            <ReactQuill
                                theme="snow"
                                value={input.requirements}
                                onChange={value => setInput({ ...input, requirements: value })}
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter job requirements..."
                            />
                        </div>
                        {/* Pay Type Selection */}
                        <div>
                            <Label>
                                Pay Type <span className="text-red-500">*</span>
                            </Label>
                            <select
                                name="payType"
                                value={input.payType}
                                onChange={handlePayTypeChange}
                                className="w-full border border-blue-300 rounded-md px-3 py-2 my-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            >
                                <option value="">Select Pay Type</option>
                                <option value="Fixed Range Salary">Fixed Range Salary</option>
                                <option value="Task/Gig-Based">Task/Gig-Based</option>
                                <option value="Commission Only">Commission Only</option>
                            </select>
                            <div className="text-xs text-gray-500 mt-1">
                                Choose how this job is paid. <br />
                                <b>Fixed Range Salary:</b> e.g. 5,000–7,000 USD/month<br />
                                <b>Task/Gig-Based:</b> e.g. "Paid per completed survey"<br />
                                <b>Commission Only:</b> e.g. "15% per sale"
                            </div>
                        </div>
                        {/* Conditional Salary Fields */}
                        {input.payType === 'Fixed Range Salary' && (
                            <>
                                <div>
                                    <Label>Minimum Salary</Label>
                                    <Input
                                        type="number"
                                        name="minSalary"
                                        value={input.minSalary}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. 5000"
                                        className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <Label>Maximum Salary</Label>
                                    <Input
                                        type="number"
                                        name="maxSalary"
                                        value={input.maxSalary}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. 7000"
                                        className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <Label>Currency</Label>
                                    <select
                                        name="currency"
                                        value={input.currency}
                                        onChange={changeEventHandler}
                                        className="w-full border border-blue-300 rounded-md px-3 py-2 my-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="ZAR">ZAR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="KES">KES</option>
                                        <option value="NGN">NGN</option>
                                        <option value="INR">INR</option>
                                        {/* Add more as needed */}
                                    </select>
                                </div>
                                <div>
                                    <Label>Pay Period</Label>
                                    <select
                                        name="payPeriod"
                                        value={input.payPeriod}
                                        onChange={changeEventHandler}
                                        className="w-full border border-blue-300 rounded-md px-3 py-2 my-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                                    >
                                        <option value="per month">per month</option>
                                        <option value="per year">per year</option>
                                        <option value="per week">per week</option>
                                        <option value="per day">per day</option>
                                        <option value="per hour">per hour</option>
                                    </select>
                                </div>
                            </>

                        )}
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
                                Work Arrangement <span className="text-red-500">*</span>
                            </Label>
                            <select
                                className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
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
                        <div className="w-full">
                            <Label>
                                Company <span className="text-red-500">*</span>
                            </Label>
                            <Combobox
                                options={(() => {
                                    const opts = companies.map(c => ({ value: c._id, label: c.name }));
                                    if (input.companyId && !opts.some(o => o.value === input.companyId)) {
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
}
export default PostJob;
