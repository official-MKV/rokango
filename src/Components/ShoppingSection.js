"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFirebaseQuery } from "@/hooks/firebase";
import { Input } from "@/Components/ui/input";
import { useCart } from "@/hooks/firebase";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import {
  PackageSearch,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Loader2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const ProductCard = ({ product, onAddToCart }) => {
  const router = useRouter();
  return (
    <Link
      href={`/product/${product.id}`}
      className="w-full h-fit flex flex-col items-center justify-between gap-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
    >
      <div className="w-full min-h-fit aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full p-2 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold truncate flex-1">
            {product.name}
          </span>
          <span className="text-sm font-bold">₦{product.price}</span>
        </div>
        <span className="text-xs text-gray-500 truncate">
          {product.description}
        </span>
        <div className="text-xs flex flex-col gap-1 mt-1">
          <span className="flex items-center">
            Brand:
            <span className="ml-1 px-2 py-1 rounded-full bg-[#faf0e4]">
              {product.brand}
            </span>
          </span>
          <span className="flex items-center">
            Supplier:
            <span className="ml-1 w-fit px-2 py-1 rounded-full bg-[#faf0e4] group relative text-nowrap overflow-hidden">
              <span className="block truncate">{product.supplier.name}</span>
              <span className="hidden group-hover:block absolute z-20 text-black bg-white p-3 text-center -top-10 -right-0 hover:opacity-100 whitespace-nowrap">
                {product.supplier.name}
              </span>
            </span>
          </span>
        </div>
      </div>
      <button
        className="w-full py-2 bg-[#ffa459] text-white font-medium hover:bg-[#fc7b12] transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(product);
        }}
      >
        Add To Cart
      </button>
    </Link>
  );
};

export default function ShoppingSection({ user }) {
  const [filters, setFilters] = useState({ active: true });
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 20;

  const {
    data: productData,
    error,
    isLoading,
    refetch,
  } = useFirebaseQuery("products", {
    filters,
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    orderByField: "name",
    orderDirection: "asc",
  });

  const { cart, addToCart } = useCart(user.uid);

  const handleSearchInputChange = useCallback((e) => {
    setSearchInputValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setSearchTerm(searchInputValue);
    setCurrentPage(1);
    refetch().then(() => {
      setIsSearching(false);
    });
  }, [searchInputValue, refetch]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchInputValue("");
    setSearchTerm("");
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { items: products, totalPages } = productData || {};

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col relative p-2 justify-center items-center">
      <div className="relative w-full mb-4 px-2 flex gap-2">
        <div className="relative w-fit">
          <Input
            placeholder="Search products..."
            value={searchInputValue}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            className="relative w-fit transition-all duration-500 ease-in-out"
          />
          {searchInputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-1 bg-[white]"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-[#ffa459] hover:bg-[#fc7b12] text-white"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {!isSearching && "Search"}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#ffa459]" />
        </div>
      ) : products?.length > 0 ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <PackageSearch size={64} />
          <p className="mt-4 text-xl font-semibold">No products found</p>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
      {cart.length > 0 && (
        <Button
          className="fixed bottom-4 right-4 z-10 bg-[#ffa459] hover:bg-[#fc7b12] shadow-[0px_0px_10px_0px_#ff7913]"
          onClick={() => {
            /* Implement view cart functionality */
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> View Order
        </Button>
      )}
    </div>
  );
}
