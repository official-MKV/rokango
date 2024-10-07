import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const MultiSelectWithSearch = ({ options, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionToggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((selected) => selected !== option));
    } else {
      onChange([...value, option]);
    }
    setIsOpen(false);
  };

  const handleRemoveOption = (option, e) => {
    e.stopPropagation();
    onChange(value.filter((selected) => selected !== option));
  };

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="border rounded p-2 cursor-pointer flex flex-wrap items-center"
        onClick={handleDropdownToggle}
      >
        {value.length > 0 ? (
          value.map((val) => (
            <span
              key={val.value}
              className="mr-2 mb-1 inline-flex items-center px-2 py-1 bg-gray-200 rounded"
            >
              {val.label}
              <button
                onClick={(e) => handleRemoveOption(val, e)}
                className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={14} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">Select categories...</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border-b"
            placeholder="Search..."
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    value.includes(option) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleOptionToggle(option)}
                >
                  {option.label}
                  {value.includes(option) && (
                    <span className="float-right text-green-600">&#10003;</span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectWithSearch;
