"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "@/Components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { Textarea } from "@/Components/ui/textarea";
import { useAuth, useFirebaseQuery } from "@/hooks/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { CategoriesLocal } from "../../../data/Categories";
import { Eye, Trash2, Edit } from "lucide-react";
import { Switch } from "@/Components/ui/switch";
import Loader from "@/Components/Loader";
import { useSupabaseQuery } from "@/hooks/supabase";
import AddProductDialog from "@/Components/AddProductDialog";
import ProductDetailsDialog from "@/Components/ProductDetailsDialog";

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;
  const { user } = useAuth();

  const {
    data: productData,
    error,
    isLoading,
    refetch,
  } = useSupabaseQuery("products", {
    filters: { "supplier.id": user?.uid },
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    orderByField: "name",
    orderDirection: "asc",
  });

  const { items: products, totalPages } = productData || {};

  const filteredProducts = products?.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!inStockOnly || product.inStock)
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageRef = ref(
        storage,
        `product-images/${Date.now()}_${file.name}`
      );
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      setEditedProduct((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await deleteDoc(doc(db, "products", productId));
        queryClient.invalidateQueries(["products", user.businessName]);
        toast({
          title: "Product Deleted",
          description: `Product ${productName} has been deleted successfully.`,
        });
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
          title: "Error",
          description:
            "There was an error deleting the product. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInStockChange = async (checked) => {
    try {
      const updatedProduct = { ...editedProduct, inStock: checked };
      if (!checked) {
        updatedProduct.quantity = 0;
      }
      const productRef = doc(db, "products", editedProduct.id);
      await updateDoc(productRef, updatedProduct);
      setEditedProduct(updatedProduct);
      queryClient.invalidateQueries(["products", user.businessName]);
      toast({
        title: "Stock Status Updated",
        description: `${editedProduct.name} is now ${
          checked ? "in stock" : "out of stock"
        }.`,
      });
    } catch (error) {
      console.error("Error updating stock status: ", error);
      toast({
        title: "Error",
        description:
          "There was an error updating the stock status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-0">
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
      <div className="mt-6 pb-[100px]">
        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="w-full">
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
                  <TableCell>{product.name}</TableCell>
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
                          setEditedProduct({ ...product });
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
                    setEditedProduct({ ...product });
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
      <ProductDetailsDialog
        product={selectedProduct}
        isEditting={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default InventoryPage;
