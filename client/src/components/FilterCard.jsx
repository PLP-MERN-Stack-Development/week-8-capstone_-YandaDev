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
        <div className="flex flex-col gap-1 min-w-[180px]">
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
        <div className="flex flex-col gap-1 min-w-[220px]">
            <Label className="text-blue-200">{label}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedFilters[filterType].map((val, idx) => (
                    <span key={val + idx} className="bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1">
                        {val}
                        <button
                            type="button"
                            className="ml-1 text-xs text-white hover:text-red-400"
                            onClick={() => handleRemoveTextFilter(filterType, val)}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => handleTextInputKeyDown(e, filterType, inputValue)}
                placeholder={`Type ${label} and press Enter`}
                className="w-full px-3 py-2 rounded border border-blue-800 bg-[#001636] text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );

    return (
        <div className="w-full flex flex-row gap-6 items-center justify-center py-6 px-8 rounded-lg shadow-lg flex-wrap bg-gradient-to-r from-[#001636] to-[#00040A] border border-blue-900">
            {renderMultiTextInput('Location', 'Location', locationInput, setLocationInput)}
            {renderMultiTextInput('Job Title', 'JobTitle', jobTitleInput, setJobTitleInput)}
            {renderMultiSelect('Date Posted', 'DatePosted', datePostedOptions)}
            {renderMultiSelect('Job Type', 'JobType', jobTypeOptions)}
            {renderMultiSelect('Experience Level', 'ExperienceLevel', experienceLevelOptions)}
            {renderMultiSelect('Work Arrangement', 'WorkArrangement', workArrangementOptions)}
            <Button
                variant="outline"
                className="ml-4 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                onClick={() => setSelectedFilters({
                    Location: [],
                    JobTitle: [],
                    DatePosted: [],
                    JobType: [],
                    ExperienceLevel: [],
                    WorkArrangement: []
                })}
            >
                Clear Filters
            </Button>
        </div>
    );
};

export default FilterCard;
