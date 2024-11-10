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
import { MultiSelect } from "react-multi-select-component";
import { useSupabaseQuery } from "@/hooks/supabase";
import { Input } from "@/Components/ui/input";
import { Loader2 } from "lucide-react"; // Spinner
import { toast } from "@/Components/ui/use-toast"; // ShadCN Toast

const EditProductDialog = ({ product, isEditing, onClose, onRefetch }) => {
  const [formInputs, setFormInputs] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const { data: categoriesData } = useSupabaseQuery("categories", {});

  useEffect(() => {
    if (product) {
      setFormInputs({
        ...product,
        Categories:
          product.categories?.map((cat) => ({
            label: cat.name,
            value: cat.slug,
          })) || [],
      });
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
      Categories: selectedOptions,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/update-product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formInputs.id,
          data: {
            name: formInputs.name,
            brand: formInputs.brand,
            price: formInputs.price,
            quantity: formInputs.quantity,
            description: formInputs.description,
          },
          categories: formInputs.Categories.map((cat) => cat.value), // sending category slugs
        }),
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast({
        title: "Success",
        description: "Product updated successfully!",
        variant: "success",
      });
      onRefetch();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              options={
                categoriesData?.items.map((cat) => ({
                  label: cat.name,
                  value: cat.slug,
                })) || []
              }
              value={formInputs.Categories}
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
            className="w-full flex justify-center items-center"
            style={{ backgroundColor: "#ffa458", color: "white" }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Update Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
