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
    pageSize: 15,
    orderByField: "name",
    orderDirection: "asc",
  });
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex overflow-x-auto gap-4 max-w-full">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-[#ffa4581a] aspect-video rounded-lg flex items-center justify-center p-4"
              >
                <Skeleton className="h-16 w-16 rounded-full" />
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
    <section className=" relative w-[50%]">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex flex-row overflow-x- gap-4 p-2 max-w-full">
        {data?.items.map((brand) => (
          <div className="w-[200px] bg-black h-[50px] relative">puppy</div>
        ))}
      </div>
    </section>
  );
}
