import React from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";

export function CategoryRow({ title, itemsToShow }) {
  const { data, isLoading, error } = useSupabaseQuery("categories", {
    pageSize: itemsToShow,
    orderByField: "name",
    orderDirection: "asc",
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-4 w-full" />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {data?.items.map((category) => (
          <div key={category.id} className="text-center">
            <img
              src={category.image}
              alt={category.label}
              className="h-[100px] w-full object-cover rounded-md"
            />
            <p className="text-xs sm:text-sm font-semibold mt-2">
              {category.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
