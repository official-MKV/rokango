"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { toast } from "@/Components/ui/use-toast";
import ProductDetailsDialog from "@/Components/ProductDetailsDialog";
import { Skeleton } from "@/Components/ui/skeleton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import EditProductDialog from "@/Components/EditProductDialog";

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();
  const itemsPerPage = 20;
  const { user } = useAuth();

  const {
    data: productData,
    error,
    isLoading,
    refetch: refetchProducts,
  } = useSupabaseQuery("products", {
    filters: { "supplier.id": user?.uid },
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    orderByField: "name",
    orderDirection: "asc",
  });

  useEffect(() => {
    if (refetch) {
      refetchProducts();
      setRefetch(false);
    }
  }, [refetch, refetchProducts]);

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
    try {
      setDeletingProductId(productId);
      const response = await fetch("/api/delete-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, supplierId: user.uid }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.hasOrders) {
          setProductToDelete({ id: productId, name: productName });
          setShowDeactivateDialog(true);
        } else {
          setProductToDelete({ id: productId, name: productName });
          setShowDeleteDialog(true);
        }
      } else {
        throw new Error(result.error || "Failed to process delete request");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  const confirmDeactivate = async () => {
    try {
      setDeletingProductId(productToDelete.id);
      await deactivateProduct(productToDelete.id);
      toast({
        title: "Product Deactivated",
        description: `${productToDelete.name} has been deactivated.`,
      });
      setRefetch(true);
    } catch (error) {
      console.error("Error deactivating product:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeactivateDialog(false);
      setProductToDelete(null);
      setDeletingProductId(null);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeletingProductId(productToDelete.id);
      await deleteProduct(productToDelete.id);
      toast({
        title: "Product Deleted",
        description: `${productToDelete.name} has been deleted.`,
      });
      setRefetch(true);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setDeletingProductId(null);
      setProductToDelete(null);
    }
  };

  const deactivateProduct = async (productId) => {
    const response = await fetch("/api/deactivate-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to deactivate product");
    }
  };

  const deleteProduct = async (productId) => {
    const response = await fetch("/api/delete-product", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  };

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setCurrentPage(1);
    refetchProducts().then(() => setIsSearching(false));
  }, [refetchProducts]);

  const TableSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );

  const CardSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative container mx-auto px-4 py-8">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{productToDelete?.name}" from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-[#cf0202]">
              {deletingProductId === productToDelete?.id ? (
                <Loader />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Product</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete?.name} is present in existing orders. It will be
              deactivated and no longer added to carts, but you have a legal
              obligation to fulfill already paid orders containing this product.
              Contact customer support at 09056595381 for more information and
              assistance. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeactivate}
              className="bg-[#cf0202]"
            >
              {deletingProductId === productToDelete?.id ? (
                <Loader />
              ) : (
                "Deactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Inventory Management
      </h1>
      <div className="flex bg-white w-full z-30 sticky top-5 flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="flex space-x-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
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
        <AddProductDialog
          user={user}
          queryClient={queryClient}
          refetch={setRefetch}
        />
      </div>
      <div className="mt-6 pb-20 sm:pb-0">
        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          {isLoading || isSearching ? (
            <TableSkeleton />
          ) : (
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
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
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
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsViewing(true);
                            setIsEditing(false);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsViewing(true);
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
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id ? (
                            <Loader className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile view */}
        <div className="sm:hidden space-y-6">
          {isLoading || isSearching ? (
            <CardSkeleton />
          ) : (
            filteredProducts?.map((product) => (
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
                    <p className="text-sm font-medium text-gray-500">
                      Quantity
                    </p>
                    <p>{product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge
                      variant={product.inStock ? "success" : "destructive"}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsViewing(true);
                      setIsEditing(false);
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsViewing(true);
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
                    disabled={deletingProductId === product.id}
                  >
                    {deletingProductId === product.id ? (
                      <Loader className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isSearching}
            className="bg-[#ffa458]"
          >
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            className="bg-[#ffa458]"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isSearching}
          >
            Next
          </Button>
        </div>
      )}
      {isViewing && (
        <ProductDetailsDialog
          product={selectedProduct}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onClose={() => {
            setIsViewing(false);
            setSelectedProduct(null);
          }}
        />
      )}
      {isViewing && (
        <EditProductDialog
          product={selectedProduct}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onClose={() => {
            setIsViewing(false);
            setIsEditing(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryPage;
