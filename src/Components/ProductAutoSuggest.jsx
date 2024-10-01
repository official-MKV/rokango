"use client";

import React, { useState, useRef, useCallback } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import debounce from "lodash/debounce";

const ProductAutosuggest = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);

  const fetchSuggestions = useCallback(
    debounce(async (value) => {
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
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1);
    setSelectedImage(null);
    fetchSuggestions(value);
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
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelection(suggestions[selectedIndex]);
      }
    }
  };

  const handleSelection = (suggestion) => {
    setInput(suggestion.name);
    setSelectedImage(suggestion.image_url);
    setSuggestions([]);
    inputRef.current.focus();
    console.log("Selected suggestion:", suggestion);
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
        <Card className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center p-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-100" : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleSelection(suggestion)}
            >
              {suggestion.image_url && (
                <img
                  src={suggestion.image_url}
                  alt={suggestion.name}
                  className="w-12 h-12 object-cover mr-2"
                />
              )}
              <span>{suggestion.name}</span>
            </div>
          ))}
        </Card>
      )}
      {selectedImage && (
        <div className="mt-4">
          <img
            src={selectedImage}
            alt="Selected product"
            className="w-full max-w-xs mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ProductAutosuggest;
