"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFirebaseQuery, useCart, useAuth } from "@/hooks/firebase";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { CategoriesLocal } from "@/data/Categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ProductCard } from "@/Components/ShoppingSection";
import Loader from "@/Components/Loader";
import {
  PackageSearch,
  ShoppingCart,
  Search,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/supabase";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";

export default function ShoppingPage() {
  return (
    <Suspense fallback={<Loader />}>
      <FullShoppingSection />
    </Suspense>
  );
}

const FullShoppingSection = () => {
  const router = useRouter();
  const user = useAuth();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    Categories: searchParams.get("categories") || "",
    supplier: searchParams.get("supplier") || "",
    brand: searchParams.get("brand") || "",
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 20;

  const [suggestions, setSuggestions] = useState({
    Categories: [],
    supplier: [],
    brand: [],
  });

  const {
    data: productData,
    error,
    refetch,
  } = useSupabaseQuery("products", {
    filters,
    page: currentPage,
    pageSize: itemsPerPage,
    searchField: "name",
    searchTerm,
    orderDirection: "desc",
  });

  const { data: suppliersData } = useFirebaseQuery("users", {
    filters: { role: "supplier" },
  });

  const { items: products, totalPages } = productData || {};
  const { cart, addToCart } = useCart(user?.uid);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });
    if (searchTerm) {
      queryParams.set("search", searchTerm);
    }
    router.push(`/shop?${queryParams.toString()}`, undefined, {
      shallow: true,
    });
  }, [filters, searchTerm, router]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestions({
        Categories: CategoriesLocal.reduce((a, item) => {
          a.push(item.label);
          return a;
        }, []),
        supplier:
          suppliersData?.items?.reduce((list, supplier) => {
            list.push(supplier.name);
            return list;
          }, []) || [],
        brand: ["Brand 1", "Brand 2"], // Replace with actual brand data
      });
    };
    fetchSuggestions();
  }, [suppliersData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "Categories" ? [value] : value,
    }));
    setCurrentPage(1);
  };

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
      value={filters[filterKey]}
      onValueChange={(value) => handleFilterChange(filterKey, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
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
  );

  const FiltersContent = () => (
    <>
      {["Categories", "supplier", "brand"].map((filterKey) => (
        <div key={filterKey} className="mb-2">
          <FilterSelect filterKey={filterKey} />
        </div>
      ))}
    </>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 sticky top-0 bg-white z-30 p-4">
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

        {/* Desktop Filters */}
        <div className="hidden md:grid md:grid-cols-3 gap-2">
          <FiltersContent />
        </div>

        {/* Mobile Filters */}
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
