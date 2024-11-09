"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseQuery } from "@/hooks/supabase";
import { useFilters } from "@/hooks/useFilters";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ProductCard } from "@/Components/ShoppingSection";
import {
  PackageSearch,
  ShoppingCart,
  Search,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";

export default function ShoppingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 20;

  const initialFilters = {
    category: searchParams.get("category")?.split(",") || "",
    brand: searchParams.get("brand") || "",
  };

  const { filters, handleFilterChange, suggestions } =
    useFilters(initialFilters);
  console.log(suggestions);
  const {
    data: productData,
    error,
    refetch,
    isLoading,
  } = useSupabaseQuery("products", {
    filters,
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    // orderByField: "created_at",
    // orderDirection: "desc",
    relations: ["product_categories"], // Fetch associated categories
  });
  if (!isLoading) {
    console.log(productData);
  }

  const { items: products, totalPages } = productData || {
    items: [],
    totalPages: 0,
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
      } else {
        queryParams.delete(key);
      }
    });
    if (searchTerm) {
      queryParams.set("search", searchTerm);
    } else {
      queryParams.delete("search");
    }
    router.push(`/shop?${queryParams.toString()}`, undefined, {
      shallow: true,
    });
  }, [filters, searchTerm, router, searchParams]);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchTerm(searchInputValue);
    setCurrentPage(1);
    refetch().then(() => {
      setIsSearching(false);
    });
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const FilterSelect = ({ filterKey }) => (
    <Select
      value={
        Array.isArray(filters[filterKey])
          ? filters[filterKey][0]
          : filters[filterKey]
      }
      onValueChange={(value) => handleFilterChange(filterKey, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
        />
      </SelectTrigger>
      <SelectContent>
        {suggestions[filterKey]?.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const FiltersContent = () => (
    <>
      {["category", "brand"].map((filterKey) => (
        <div key={filterKey} className="mb-2">
          <FilterSelect filterKey={filterKey} />
        </div>
      ))}
    </>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Filters Section */}
      <div className="mb-4 sticky top-0 bg-white z-30 p-4">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <div className="flex-grow relative">
            <Input
              placeholder="Search products..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="pr-8"
            />
            {searchInputValue && (
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
              <Search className="h-4 w-4 mr-2" />
            )}
            {!isSearching && "Search"}
          </Button>
        </div>

        {/* Filters */}
        <div className="hidden md:grid md:grid-cols-2 gap-2">
          <FiltersContent />
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                Filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Products Section */}
      {error ? (
        <div>Error: {error.message}</div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <PackageSearch size={64} />
          <p className="mt-4 text-xl font-semibold">No products found</p>
        </div>
      )}

      {/* Pagination */}
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
    </div>
  );
}
