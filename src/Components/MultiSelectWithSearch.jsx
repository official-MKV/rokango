import React, { useState } from "react";

const MultiSelectWithSearch = ({ options, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionToggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((selected) => selected !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        className="border rounded p-2 cursor-pointer"
        onClick={handleDropdownToggle}
      >
        {value.length > 0
          ? value.map((val) => (
              <span
                key={val.value}
                className="mr-2 inline-block px-2 py-1 bg-gray-200 rounded"
              >
                {val.label}
              </span>
            ))
          : "Select categories..."}
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
