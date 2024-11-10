"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import EditProductDialog from "./EditProductDialog";

const ProductDetailsDialog = ({
  product,
  onClose,
  isEditing,
  setIsEditing,
}) => {
  if (!product) return null;

  const renderProductDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-lg text-gray-600">{product.brand}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Price</p>
          <p className="text-lg font-semibold text-gray-900">
            ₦{product.price.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Quantity</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.quantity}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p
            className={`text-lg font-semibold ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Categories</p>
          <p className="text-lg text-gray-900">
            {product.categories?.map((category) => category.name).join(", ")}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Description</p>
        <p className="text-gray-700 mt-1">{product.description}</p>
      </div>
      <Button
        onClick={() => setIsEditing(true)}
        className="w-full"
        style={{ backgroundColor: "#ffa458", color: "white" }}
      >
        Edit Product
      </Button>
    </div>
  );

  return (
    <>
      <Dialog open={product !== null && !isEditing} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {renderProductDetails()}
        </DialogContent>
      </Dialog>
      {isEditing && (
        <EditProductDialog
          product={product}
          onClose={() => setIsEditing(false)}
          isEditing={isEditing}
        />
      )}
    </>
  );
};

export default ProductDetailsDialog;
