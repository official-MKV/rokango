"use client";

import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

const ProductAutosuggest = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1);

    if (value.length > 1) {
      try {
        const response = await fetch(
          `/api/product-suggestions?query=${encodeURIComponent(value)}`
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Tab" || e.key === " ") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        completeSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        // Handle selection
        console.log("Selected:", suggestions[selectedIndex]);
        setInput("");
        setSuggestions([]);
      }
    }
  };

  const completeSuggestion = (suggestion) => {
    setInput(suggestion.name);
    inputRef.current.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type product name..."
        className="w-full"
      />
      {suggestions.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center p-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-100" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                console.log("Selected:", suggestion);
                setInput("");
                setSuggestions([]);
              }}
            >
              {suggestion.image_url && (
                <img
                  src={suggestion.image_url}
                  alt={suggestion.name}
                  className="w-12 h-12 object-cover mr-2"
                />
              )}
              <span>
                {suggestion.name.substring(0, input.length)}
                <span className="text-gray-400">
                  {suggestion.name.substring(input.length)}
                </span>
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default ProductAutosuggest;
