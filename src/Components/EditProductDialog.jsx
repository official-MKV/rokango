"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { CategoriesLocal } from "@/data/Categories";
import { MultiSelect } from "react-multi-select-component";
import { Input } from "@/Components/ui/input";

const EditProductDialog = ({ product, isEditing, onClose }) => {
  const [formInputs, setFormInputs] = useState({ ...product });

  useEffect(() => {
    if (product) {
      setFormInputs({ ...product });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === "number" ? Math.max(0, parseFloat(value)) : value;
    setFormInputs((prev) => ({
      ...prev,
      [name]: newValue,
      inStock: name === "quantity" && newValue > 0,
    }));
  };

  const handleCategoriesChange = (selectedOptions) => {
    setFormInputs((prev) => ({
      ...prev,
      Categories: selectedOptions.map((option) => option.value),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Logic to submit edited product to the backend (Supabase or another API)
    console.log("Submitting updated product:", formInputs);
    onClose(); // Close the dialog after successful submission
  };

  return (
    <Dialog open={product !== null && isEditing} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formInputs.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formInputs.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formInputs.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formInputs.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="Categories">Categories</Label>
            <MultiSelect
              options={CategoriesLocal}
              value={formInputs.Categories.map((cat) => ({
                label: cat,
                value: cat,
              }))}
              onChange={handleCategoriesChange}
              labelledBy="Select"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formInputs.description}
              onChange={handleInputChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: "#ffa458", color: "white" }}
          >
            Update Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
