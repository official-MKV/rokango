"use client";
import React from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";
import { useRouter } from "next/navigation";

export default function CategoryRow({ title, itemsToShow }) {
  const { data, isLoading, error } = useSupabaseQuery("categories", {
    pageSize: itemsToShow,
    orderByField: "name",
    orderDirection: "asc",
  });
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex-shrink-0 w-32 space-y-2">
                <Skeleton className="h-32 w-full" />
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
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {data?.items.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 w-32 text-center hover:scale-105 cursor-pointer"
            onClick={() => {
              router.push(`/shop?category=${data.slug}`);
            }}
          >
            <img
              src={category.image}
              alt={category.label}
              className="h-32 w-full object-cover rounded-md"
            />
            <p className="text-xs font-semibold mt-2 truncate">
              {category.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
