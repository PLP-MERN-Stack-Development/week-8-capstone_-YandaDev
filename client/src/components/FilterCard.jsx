import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Label } from './ui/label';
import { Button } from './ui/button';

const locationOptions = ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth"];
const jobTitleOptions = ["Frontend Developer", "Backend Developer", "FullStack Developer", "Designer", "QA Engineer"];
const datePostedOptions = ["Anytime", "Past Month", "Past Week", "Past 24 Hours"];
const jobTypeOptions = ["Full Time", "Part Time", "Contract"];
const experienceLevelOptions = ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"];
const workArrangementOptions = ["On-site", "Hybrid", "Remote"];

const FilterCard = () => {
    // Restore renderMultiSelect for dropdown filters
    const renderMultiSelect = (label, filterType, options) => (
        <div className="flex flex-col gap-1 min-w-[180px] w-[180px]">
            <Label className="text-blue-200">{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left bg-[#001636] text-blue-100 border-blue-800">
                        {selectedFilters[filterType].length > 0
                            ? selectedFilters[filterType].join(', ')
                            : `Select ${label}`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#001636] border-blue-800 text-blue-100 w-56 p-2 rounded shadow-lg">
                    {options.map((option, idx) => (
                        <div key={option + idx} className="flex items-center gap-2 py-1">
                            <input
                                type="checkbox"
                                id={`${filterType}-${idx}`}
                                checked={selectedFilters[filterType].includes(option)}
                                onChange={() => handleFilterChange(filterType, option)}
                                className="accent-blue-600"
                            />
                            <label htmlFor={`${filterType}-${idx}`} className="text-blue-100 cursor-pointer">
                                {option}
                            </label>
                        </div>
                    ))}
                </PopoverContent>
            </Popover>
        </div>
    );
    const [selectedFilters, setSelectedFilters] = useState({
        Location: [],
        JobTitle: [],
        DatePosted: [],
        JobType: [],
        ExperienceLevel: [],
        WorkArrangement: []
    });

    const dispatch = useDispatch();

    // Handle checkbox change for multi-select
    const handleFilterChange = (filterType, value) => {
        setSelectedFilters((prevFilters) => {
            const currentSelections = prevFilters[filterType];
            const newSelections = currentSelections.includes(value)
                ? currentSelections.filter((item) => item !== value)
                : [...currentSelections, value];
            return {
                ...prevFilters,
                [filterType]: newSelections,
            };
        });
    };

    // Create a combined search query from the selected filters
    useEffect(() => {
        dispatch(setSearchedQuery(selectedFilters));
    }, [selectedFilters, dispatch]);

    // Multi-text input for Location and Job Title filters
    const [locationInput, setLocationInput] = useState("");
    const [jobTitleInput, setJobTitleInput] = useState("");

    const handleTextInputKeyDown = (e, filterType, inputValue) => {
        if (e.key === "Enter" && inputValue.trim()) {
            setSelectedFilters(prev => ({
                ...prev,
                [filterType]: [...prev[filterType], inputValue.trim()]
            }));
            if (filterType === "Location") setLocationInput("");
            if (filterType === "JobTitle") setJobTitleInput("");
        }
    };

    const handleRemoveTextFilter = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].filter(v => v !== value)
        }));
    };

    // Render multi-text input filter
    const renderMultiTextInput = (label, filterType, inputValue, setInputValue) => (
        <div className="flex flex-col gap-1 min-w-[180px] w-[180px]">
            <Label className="text-blue-200 mb-2 mt-2">{label}</Label>
            <div className="relative w-full">
                <input
                    type="text"
                    value={
                        inputValue !== ""
                            ? inputValue
                            : (selectedFilters[filterType].length > 0 ? selectedFilters[filterType][0] : "")
                    }
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => handleTextInputKeyDown(e, filterType, inputValue)}
                    placeholder={
                        inputValue === "" && selectedFilters[filterType].length === 0
                            ? `Enter ${label.toLowerCase()} and press enter`
                            : ""
                    }
                    className="w-full px-3 py-2 rounded border border-blue-800 bg-[#001636] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm h-10 -mt-6 pr-2 placeholder:text-blue-300"
                />
                {(inputValue || selectedFilters[filterType].length > 0) && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-red-400 focus:outline-none"
                        onClick={() => {
                            setInputValue("");
                            setSelectedFilters(prev => ({
                                ...prev,
                                [filterType]: []
                            }));
                        }}
                        aria-label={`Clear ${label} input`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
                            <path d="M13 7L7 13M7 7l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-full mx-auto flex flex-wrap md:flex-row flex-col items-center py-6 px-2 md:px-4 rounded-2xl shadow-2xl bg-gradient-to-br from-[#001636] to-[#00040A] border border-blue-900 gap-4">
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiTextInput('Location', 'Location', locationInput, setLocationInput)}</div>
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiTextInput('Job Title', 'JobTitle', jobTitleInput, setJobTitleInput)}</div>
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiSelect('Date Posted', 'DatePosted', datePostedOptions)}</div>
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiSelect('Job Type', 'JobType', jobTypeOptions)}</div>
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiSelect('Experience Level', 'ExperienceLevel', experienceLevelOptions)}</div>
            <div className="flex flex-col min-w-[160px] w-full sm:w-[180px]">{renderMultiSelect('Work Arrangement', 'WorkArrangement', workArrangementOptions)}</div>
            <div className="flex flex-col min-w-[70px] w-[70px] justify-center items-center mt-4">
                <Button
                    variant="outline"
                    className="w-full h-8 text-xs font-semibold border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-lg px-0 py-1 shadow transition-all duration-200"
                    style={{ alignSelf: 'flex-start', minWidth: '60px', maxWidth: '70px' }}
                    onClick={() => setSelectedFilters({
                        Location: [],
                        JobTitle: [],
                        DatePosted: [],
                        JobType: [],
                        ExperienceLevel: [],
                        WorkArrangement: []
                    })}
                >
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default FilterCard;
