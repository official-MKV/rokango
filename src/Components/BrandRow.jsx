"use client";
import React from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";
import { useRouter } from "next/navigation";

export function BrandRow({
  title = "Featured Brands",
  tableName = "brands",
  itemsToShow = 15,
}) {
  const { data, isLoading, error } = useSupabaseQuery(tableName, {
    pageSize: 6,
    orderByField: "name",
    orderDirection: "asc",
  });
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-[#ffa4581a] aspect-video rounded-lg flex items-center justify-center p-4"
              >
                <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
              </div>
            ))}
        </div>
      </section>
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
    <section className="space-y-4 w-full">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.items.map((brand) => (
          <div
            key={brand.id}
            onClick={() => router.push(`/shop?brand=${brand.slug}`)}
            className="bg-[#ffa4581a] aspect-video rounded-lg flex items-center justify-center p-4 cursor-pointer transition-transform transform hover:scale-105"
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-16 w-16 md:h-24 md:w-24 object-contain"
              />
            ) : (
              <span className="text-lg md:text-2xl font-bold text-muted-foreground text-center">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
