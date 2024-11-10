"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { ProductCard } from "./ShoppingSection";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";
import { Button } from "./ui/button";

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

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true); // Set initially to true

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          Math.ceil(container.scrollLeft + container.clientWidth) <
            container.scrollWidth
        );
      };

      // Check initial scroll state
      handleScroll();

      // Add scroll event listener
      container.addEventListener("scroll", handleScroll);

      // Add resize observer to handle window resizing
      const resizeObserver = new ResizeObserver(() => {
        handleScroll();
      });

      resizeObserver.observe(container);

      // Cleanup
      return () => {
        container.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [data]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 300; // Approximate width of each card including margin
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
    <div className="space-y-4 relative">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <div className="relative">
        <div
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide relative"
          ref={scrollContainerRef}
        >
          {data?.items.map((product) => (
            <div key={product.id} className="flex-shrink-0 md:w-64 w-[10rem]">
              <ProductCard product={product} onAddToCart={() => {}} />
            </div>
          ))}
        </div>

        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ml-2 bg-white"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 mr-2 bg-white"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
