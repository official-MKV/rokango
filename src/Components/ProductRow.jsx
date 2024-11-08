import React from "react";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";

export function ProductRow({
  title,
  tableName = "products",
  categoryId,
  itemsToShow,
}) {
  // Define filters to include category
  const filters = categoryId ? { category_id: categoryId } : {};

  const { data, isLoading, error } = useSupabaseQuery(tableName, {
    filters,
    pageSize: itemsToShow,
    orderByField: "created_at",
    orderDirection: "desc",
    relations: ["product_categories"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-4 overflow-x-auto">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2 w-48 shrink-0">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load {title.toLowerCase()}. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto">
        {data?.items.map((product) => (
          <div key={product.id} className="w-48 shrink-0">
            <ProductCard product={product} onAddToCart={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}
