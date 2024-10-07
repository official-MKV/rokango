"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { useAuth, useFirebaseQuery } from "@/hooks/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Edit } from "lucide-react";
import Loader from "@/Components/Loader";
import { useSupabaseQuery } from "@/hooks/supabase";
import AddProductDialog from "@/Components/AddProductDialog";
import ProductDetailsDialog from "@/Components/ProductDetailsDialog";

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;
  const { user } = useAuth();

  const {
    data: productData,
    error,
    isLoading,
  } = useSupabaseQuery("products", {
    filters: { "supplier.id": user?.uid },
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    orderByField: "name",
    orderDirection: "asc",
  });
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);
  const { items: products, totalPages } = productData || {};

  const filteredProducts = products?.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!inStockOnly || product.inStock)
  );

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      // Implement delete functionality
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className=" relative container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Inventory Management
      </h1>
      <div className="flex bg-white w-full z-30 sticky top-5  flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex items-center">
            <Checkbox
              id="inStockOnly"
              checked={inStockOnly}
              onCheckedChange={setInStockOnly}
            />
            <Label htmlFor="inStockOnly" className="ml-2">
              In Stock Only
            </Label>
          </div>
        </div>
        <AddProductDialog user={user} />
      </div>
      <div className="mt-6 pb-20 sm:pb-0">
        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>₦{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.inStock ? "success" : "destructive"}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        size="sm"
                        variant="ghost"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditing(true);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden space-y-6">
          {filteredProducts?.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {product.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p>₦{product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p>{product.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={product.inStock ? "success" : "destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setSelectedProduct(product)}
                  size="sm"
                  variant="ghost"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditing(true);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {3 > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-[#ffa458]"
          >
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            className="bg-[#ffa458]"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
      <ProductDetailsDialog
        product={selectedProduct}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default InventoryPage;
