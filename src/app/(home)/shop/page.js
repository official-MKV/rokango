"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFirebaseQuery, useCart, useAuth } from "@/hooks/firebase";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Slider } from "@/Components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ProductCard } from "@/Components/ShoppingSection";
import { PackageSearch, ShoppingCart } from "lucide-react";

export default function ShoppingPage() {
  return (
    <Suspense>
      <FullShoppingSection />
    </Suspense>
  );
}

const FullShoppingSection = () => {
  const router = useRouter();
  const user = useAuth();

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: { value: searchParams.get("category") || "", matchType: "exact" },
    supplier: { value: searchParams.get("supplier") || "", matchType: "exact" },
    manufacturer: {
      value: searchParams.get("manufacturer") || "",
      matchType: "exact",
    },
    brand: { value: searchParams.get("brand") || "", matchType: "exact" },

    searchTerm: {
      value: searchParams.get("search") || "",
      matchType: "contains",
    },
  });

  const [suggestions, setSuggestions] = useState({
    category: [],
    supplier: [],
    manufacturer: [],
    brand: [],
  });

  const {
    data: products,
    isLoading,
    error,
  } = useFirebaseQuery("products", filters);
  const { cart, addToCart } = useCart(user.uid);

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
  }, [filters]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestions({
        category: ["Electronics", "Clothing", "Books"],
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
  };

  const filteredProducts = products || [];
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:relative fixed w-full z-50 bg-[white] px-[20px] md:top-0 md:px-0 md:pb-0 top-[80px] pb-[10px]">
        <Input
          placeholder="Search products..."
          value={filters.searchTerm.value}
          onChange={(e) =>
            handleFilterChange("searchTerm", e.target.value, "contains")
          }
        />
        <Select
          value={filters.category.value}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {suggestions.category.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.supplier.value}
          onValueChange={(value) => handleFilterChange("supplier", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent>
            {suggestions.supplier.map((sup) => (
              <SelectItem key={sup} value={sup}>
                {sup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.manufacturer.value}
          onValueChange={(value) => handleFilterChange("manufacturer", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            {suggestions.manufacturer.map((man) => (
              <SelectItem key={man} value={man}>
                {man}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.brand.value}
          onValueChange={(value) => handleFilterChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            {suggestions.brand.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[300px] md:mt-0">
          {filteredProducts.map((product) => (
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

      {cart.length > 0 && (
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
