"use client";
import React from "react";
import ProductAutosuggest from "@/Components/ProductAutoSuggest";

const page = () => {
  const handleProductSelect = (product) => {
    // Handle the selected product here
    console.log("Selected product:", product);
  };

  return (
    <div>
      <h2>Add Product to Inventory</h2>
      <ProductAutosuggest onSelect={handleProductSelect} />
      {/* Rest of your form */}
    </div>
  );
};

export default page;
