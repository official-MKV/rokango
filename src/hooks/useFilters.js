import { useState, useEffect } from "react";
import { useSupabaseQuery } from "@/hooks/supabase";

export const useFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const { data: categoriesData } = useSupabaseQuery("categories", {});
  const { data: brandsData } = useSupabaseQuery("brands", {});

  const [suggestions, setSuggestions] = useState({
    categories: [],
    brand: [],
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestions({
        category: categoriesData?.items.map((category) => ({
          value: category.slug,
          label: category.name,
        })),
        brand: brandsData?.items.map((brand) => ({
          value: brand.slug,
          label: brand.name,
        })),
      });
    };
    fetchSuggestions();
  }, [categoriesData, brandsData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { filters, handleFilterChange, suggestions };
};
