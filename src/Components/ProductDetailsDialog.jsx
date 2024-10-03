"use client";
import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

import { toast } from "@/Components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";

import { Textarea } from "@/Components/ui/textarea";

import { CategoriesLocal } from "@/data/Categories";

const ProductDetailsDialog = ({ product, isEditing, setIsEditing }) => {
  if (!product) return null;
  const [formInputs, setFormInputs] = useState({ ...product });

  const handleInStockChange = (checked) => {
    setFormInputs((prev) => ({
      ...prev,
      inStock: checked,
      quantity: checked ? Math.max(1, prev.quantity) : 0,
    }));
  };

  const handleInputChangeLocal = (e) => {
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

    try {
      const productRef = doc(db, "products", formInputs.id);
      const updatedProduct = {
        ...formInputs,
        price: parseFloat(formInputs.price),
        quantity: parseInt(formInputs.quantity),
      };

      await updateDoc(productRef, updatedProduct);
      queryClient.invalidateQueries(["products", user.businessName]);

      toast({
        title: "Product Updated",
        description: `Product ${updatedProduct.name} has been updated successfully.`,
      });

      setIsEditing(false);
      setSelected(null);
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({
        title: "Error",
        description:
          "There was an error updating the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
      <DialogContent>
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
              onChange={handleInputChangeLocal}
              required
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formInputs.brand}
              onChange={handleInputChangeLocal}
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
              onChange={handleInputChangeLocal}
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
              onChange={handleInputChangeLocal}
              required
            />
          </div>
          <div>
            <Label htmlFor="Categories">Categories</Label>
            <MultiSelect
              options={CategoriesLocal}
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
              onChange={handleInputChangeLocal}
            />
          </div>
          <Button
            type="submit"
            style={{ backgroundColor: "#ffa459", color: "white" }}
          >
            Update Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
