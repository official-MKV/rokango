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
    filter: { "supplier.id": user?.uid },
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

  const AddProductDialog = () => {
    const [newProduct, setNewProduct] = useState({
      name: "",
      brand: "",
      price: "",
      quantity: "",
      inStock: true,
      active: true,
      description: "",
      Categories: [],
      image: null,
      supplier: { name: user?.businesName, id: user?.uid },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState([]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoriesChange = (selectedOptions) => {
      setSelected(selectedOptions);
      setNewProduct((prev) => ({
        ...prev,
        Categories: selectedOptions.map((option) => option.value),
      }));
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      setNewProduct((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        let imageUrl = "";
        if (newProduct.image) {
          const imageRef = ref(
            storage,
            `product-images/${Date.now()}_${newProduct.image.name}`
          );
          await uploadBytes(imageRef, newProduct.image);
          imageUrl = await getDownloadURL(imageRef);
        }

        const productData = {
          ...newProduct,
          image: imageUrl,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity),
          supplier: { name: user.businessName, id: user.uid },
          createdAt: new Date(),
        };
        console.log(productData);

        const docRef = await addDoc(collection(db, "products"), productData);
        delete productData.image;
        queryClient.invalidateQueries(["products", user.businessName]);
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
          categories: [],
          image: null,
        });
      } catch (error) {
        console.error("Error adding product: ", error);
        toast({
          title: "Error",
          description:
            "There was an error adding the product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            style={{ backgroundColor: "#ffa459", color: "white" }}
          >
            Add New Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
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
              <MultiSelect
                options={CategoriesLocal}
                value={selected}
                onChange={handleCategoriesChange}
                labelledBy="Select"
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                name="inStock"
                checked={newProduct.inStock}
                onCheckedChange={(checked) =>
                  setNewProduct((prev) => ({ ...prev, inStock: checked }))
                }
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
            <Button
              type="submit"
              style={{ backgroundColor: "#ffa459", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const ProductDetailsDialog = ({ product }) => {
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
      let newValue = type === "number" ? parseFloat(value) : value;

      setFormInputs((prev) => {
        const newInputs = { ...prev, [name]: newValue };

        if (name === "quantity") {
          newInputs.quantity = Math.max(0, newValue); // Ensure quantity is not negative
          newInputs.inStock = newInputs.quantity > 0;
        }

        return newInputs;
      });
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
        setSelectedProduct(updatedProduct);
        setEditedProduct(updatedProduct);
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
      <Dialog
        open={!!product}
        onOpenChange={() => {
          setSelectedProduct(null);
          setIsEditing(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : product.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
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
                  <Label htmlFor="price">Price (₦)</Label>
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
                    min={0}
                    value={formInputs.quantity}
                    onChange={handleInputChangeLocal}
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
                    onChange={handleInputChangeLocal}
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formInputs.inStock}
                    onCheckedChange={handleInStockChange}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#ffa459", color: "white" }}
                >
                  Save Changes
                </Button>
              </form>
            ) : (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>SKU:</strong> {product.id}
                  </p>
                  <p>
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p>
                    <strong>Price:</strong> ₦{product.price.toFixed(2)}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                </div>
                <p className="text-sm">
                  <strong>Description:</strong> {product.description}
                </p>
                <p className="text-sm">
                  <strong>Manufacturer:</strong> {product.manufacturer}
                </p>
                <p className="text-sm">
                  <strong>Supplier:</strong> {product.supplier.name}
                </p>
                {product.Categories && (
                  <div>
                    <strong>Categories:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.Categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={product.inStock}
                    onCheckedChange={(checked) => handleInStockChange(checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedProduct({ ...product });
                    }}
                    style={{ backgroundColor: "#ffa459", color: "white" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
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
        <AddProductDialog />
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
      <ProductDetailsDialog product={selectedProduct} />
    </div>
  );
};

export default InventoryPage;
