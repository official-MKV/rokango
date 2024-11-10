import React from "react";
import { ProductCard } from "./ShoppingSection";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";

export default function ProductRow({
  title,
  tableName = "products",
  categoryId,
  itemsToShow,
}) {
  const filters = categoryId ? { category: categoryId } : {};

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
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 space-y-2">
                <Skeleton className="h-48 w-full" />
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
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {data?.items.map((product) => (
          <div key={product.id} className="flex-shrink-0 md:w-64 w-[10rem]">
            <ProductCard product={product} onAddToCart={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}
