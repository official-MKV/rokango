"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useFirebaseQuery } from "@/hooks/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { Categories } from "../../../data/Categories";
import ProductPage from "@/app/(home)/product/[id]/page";

// Mock data for demonstration
const mockProducts = [
  {
    id: "SKU001",
    name: "Ergonomic Office Chair",
    brand: "ComfortPlus",
    categories: ["Furniture", "Office Supplies"],
    description:
      "Adjustable office chair with lumbar support and breathable mesh",
    image:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    inStock: true,
    manufacturer: "ComfortPlus",
    price: 249.99,
    quantity: 30,
    supplier: "Office Essentials Inc.",
  },
  // Add more mock products here...
];

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selected, setSelected] = useState([]);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    data: products,
    isLoading,
    error,
  } = useFirebaseQuery("products", {
    supplier: user?.businessName,
  });

  const filteredProducts = products?.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!inStockOnly || product.inStock)
  );

  const AddProductDialog = () => {
    const [newProduct, setNewProduct] = useState({
      name: "",
      brand: "",
      price: "",
      quantity: "",
      inStock: true,
      description: "",
      Categories: [],
      image: null,
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
        // Upload image to Firebase Storage
        let imageUrl = "";
        if (newProduct.image) {
          const imageRef = ref(
            storage,
            `product-images/${Date.now()}_${newProduct.image.name}`
          );
          await uploadBytes(imageRef, newProduct.image);
          imageUrl = await getDownloadURL(imageRef);
        }

        // Prepare product data
        const productData = {
          ...newProduct,
          image: imageUrl,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity),
          supplier: user.businessName,
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

        // Reset form and close dialog
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
        // Here you would close the dialog
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
                options={Categories}
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

    return (
      <Dialog open={!!product} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <p>
              <strong>SKU:</strong> {product.id}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </p>
            <p>
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>
            <p>
              <strong>Supplier:</strong> {product.supplier}
            </p>
            {product.categories && (
              <div>
                <strong>Categories:</strong>
                {product.categories.map((category, index) => (
                  <Badge key={index} className="ml-2">
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            <Badge className={product.inStock ? "bg-green-500" : "bg-red-500"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#ffa459]">
        Inventory Management
      </h1>

      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>
      </div>

      <AddProductDialog />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead className="hidden sm:table-cell">SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer"
              >
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {product.id}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {product.brand}
                </TableCell>
                <TableCell>₦{product.price.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {product.quantity}
                </TableCell>
                <TableCell>
                  <Badge
                    className={product.inStock ? "bg-green-500" : "bg-red-500"}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDetailsDialog product={selectedProduct} />
    </div>
  );
};

export default InventoryPage;
