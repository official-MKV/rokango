import React from "react";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";

export function ProductRow({ title, tableName, filters = {}, itemsToShow }) {
  const { data, isLoading, error } = useSupabaseQuery(tableName, {
    filters,
    pageSize: itemsToShow,
    orderByField: "created_at",
    orderDirection: "desc",
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
