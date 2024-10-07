"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "@/Components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { CategoriesLocal } from "@/data/Categories";
import MultiSelectWithSearch from "./MultiSelectWithSearch";
import { StethoscopeIcon } from "lucide-react";

const AddProductDialog = ({ user, queryClient }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    quantity: "",
    inStock: true,
    active: true,
    description: "",
    Categories: [],
    supplier: { name: user?.businessName, id: user?.uid },
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, brand, price, quantity, Categories } = newProduct;
    const isValid =
      name.trim() !== "" &&
      brand.trim() !== "" &&
      price !== null &&
      quantity !== null &&
      Categories.length > 0;
    setIsFormValid(isValid);
  }, [newProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "price" || name === "quantity" ? Math.max(0, value) : value;
    setNewProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCategoriesChange = (selectedOptions) => {
    setSelected(selectedOptions);
    setNewProduct((prev) => ({
      ...prev,
      Categories: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    setNewProduct((prev) => ({ ...prev, name: value }));
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

  const handleProductSelection = (selectedProduct) => {
    setNewProduct({
      ...newProduct,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity || 1,
      description: selectedProduct.description,
      Categories: selectedProduct.categories || [],
    });
    setSearchTerm(selectedProduct.name);
    setSuggestions([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "productData",
        JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity),
          createdAt: new Date().toISOString(),
        })
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/add-product", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const result = await response.json();

      queryClient.invalidateQueries(["products"]);

      toast({
        title: "Product Added",
        description: `Product ${newProduct.name} has been added successfully.`,
      });

      setNewProduct({
        name: "",
        brand: "",
        price: "",
        quantity: "",
        inStock: true,
        description: "",
        Categories: [],
        supplier: { name: user?.businessName, id: user?.uid },
      });
      setImageFile(null);
      setSelected([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({
        title: "Error",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog className="min-h-screen" open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mb-4"
          style={{ backgroundColor: "#ffa459", color: "white" }}
        >
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for a product or enter new name"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleProductSelection(suggestion)}
                  >
                    {suggestion.image_url && (
                      <img
                        src={suggestion.image_url}
                        alt={suggestion.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                    )}
                    <span>{suggestion.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={newProduct.brand}
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
              value={newProduct.price}
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
              value={newProduct.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="Categories">Categories</Label>
            <MultiSelectWithSearch
              options={CategoriesLocal}
              value={selected}
              onChange={handleCategoriesChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
          {imageFile && (
            <div>
              <Label>Selected Image</Label>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Selected product image"
                className="w-24 h-24 object-cover rounded mt-2"
              />
            </div>
          )}
          <Button
            type="submit"
            style={{ backgroundColor: "#ffa459", color: "white" }}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
