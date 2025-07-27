import React, { useState, useRef, useEffect } from 'react';

const Combobox = ({ options, value, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  const filtered = options.filter(option =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  // When value changes from outside, update the input to show the selected label
  useEffect(() => {
    if (value) {
      const selected = options.find(option => option.value === value);
      if (selected && selected.label !== query) setQuery(selected.label);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative w-full" ref={boxRef}>
      <input
        type="text"
        className="w-full border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={query}
        ref={inputRef}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onChange(''); // reset selection if user starts typing
        }}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-10 w-full bg-white border-2 border-red-400 rounded-md mt-1 min-h-[40px] max-h-48 overflow-y-auto shadow-lg">
          {filtered.length > 0 ? (
            filtered.map(option => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${value === option.value ? 'bg-blue-50 font-bold' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setQuery(option.label);
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400 select-none">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
