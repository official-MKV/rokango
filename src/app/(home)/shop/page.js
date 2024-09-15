"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFirebaseQuery, useCart, useAuth } from "@/hooks/firebase";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Categories } from "@/data/Categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ProductCard } from "@/Components/ShoppingSection";
import { PackageSearch, ShoppingCart, Search, Loader2, X } from "lucide-react";

export default function ShoppingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FullShoppingSection />
    </Suspense>
  );
}

const FullShoppingSection = () => {
  const router = useRouter();
  const user = useAuth();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    supplier: searchParams.get("supplier") || "",
    manufacturer: searchParams.get("manufacturer") || "",
    brand: searchParams.get("brand") || "",
    searchTerm: searchParams.get("search") || "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 20;

  const [suggestions, setSuggestions] = useState({
    category: [],
    supplier: [],
    manufacturer: [],
    brand: [],
  });

  const {
    data: productData,
    error,
    refetch,
  } = useFirebaseQuery("products", {
    filters: { ...filters, active: true },
    page: currentPage,
    limit: itemsPerPage,
    searchField: "name",
    searchTerm: filters.searchTerm.value,
    orderByField: "createdAt",
    orderDirection: "desc",
  });

  const { items: products, totalPages } = productData || {};
  const { cart, addToCart } = useCart(user?.uid);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, { value }]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });
    router.push(`/shop?${queryParams.toString()}`, undefined, {
      shallow: true,
    });
  }, [filters, router]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestions({
        category: Categories.reduce((a, item) => {
          a.push(item.label);
          return a;
        }, []),
        supplier: ["Supplier A", "Supplier B"],
        manufacturer: ["Manufacturer X", "Manufacturer Y"],
        brand: ["Brand 1", "Brand 2"],
      });
    };
    fetchSuggestions();
  }, []);

  const handleFilterChange = (key, value, matchType = "exact") => {
    setFilters((prev) => ({
      ...prev,
      [key]: { value, matchType },
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setIsSearching(true);
    refetch().then(() => {
      setIsSearching(false);
    });
  };

  const clearSearch = () => {
    handleFilterChange("searchTerm", "", "contains");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sticky top-0 bg-white z-50 p-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex gap-2">
          <div className="flex-grow relative">
            <Input
              placeholder="Search products..."
              value={filters.searchTerm.value}
              onChange={(e) =>
                handleFilterChange("searchTerm", e.target.value, "contains")
              }
              className="pr-8"
            />
            {filters.searchTerm.value && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
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
        {["category", "supplier", "brand"].map((filterKey) => (
          <Select
            key={filterKey}
            value={filters[filterKey].value}
            onValueChange={(value) => handleFilterChange(filterKey, value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  filterKey.charAt(0).toUpperCase() + filterKey.slice(1)
                }
              />
            </SelectTrigger>
            <SelectContent>
              {suggestions[filterKey].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {error ? (
        <div>Error: {error.message}</div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
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

      {cart && cart.length > 0 && (
        <Button
          className="fixed bottom-4 right-4 z-10 bg-[#ffa459] hover:bg-[#fc7b12]"
          onClick={() => router.push("/cart")}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> View Cart ({cart.length})
        </Button>
      )}
    </div>
  );
};
