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
        // Flatten arrays and join into a string
        const searchQuery = Object.values(selectedFilters)
            .flat()
            .filter(Boolean)
            .join(' ')
            .trim();
        dispatch(setSearchedQuery(searchQuery));
    }, [selectedFilters, dispatch]);

    // Helper to render a multi-select popover for a filter
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

    return (
        <div className="w-full flex flex-row gap-6 items-center justify-center py-6 px-8 rounded-lg shadow-lg flex-wrap bg-gradient-to-r from-[#001636] to-[#00040A] border border-blue-900">
            {renderMultiSelect('Location', 'Location', locationOptions)}
            {renderMultiSelect('Job Title', 'JobTitle', jobTitleOptions)}
            {renderMultiSelect('Date Posted', 'DatePosted', datePostedOptions)}
            {renderMultiSelect('Job Type', 'JobType', jobTypeOptions)}
            {renderMultiSelect('Experience Level', 'ExperienceLevel', experienceLevelOptions)}
            {renderMultiSelect('Work Arrangement', 'WorkArrangement', workArrangementOptions)}
        </div>
    );
};

export default FilterCard;
