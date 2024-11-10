"use client";
import React, { useRef, useState, useEffect } from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useSupabaseQuery } from "@/hooks/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";

export default function BrandRow({
  title = "Featured Brands",
  tableName = "brands",
  itemsToShow = 15,
}) {
  const { data, isLoading, error } = useSupabaseQuery(tableName, {
    pageSize: itemsToShow,
    orderByField: "name",
    orderDirection: "asc",
  });
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial state

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [data]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div>
          {Array(itemsToShow)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-[#ffa4581a] rounded-lg flex-shrink-0 w-32 h-32 flex items-center justify-center p-4"
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
    <section className="space-y-4 w-full overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      <div className="relative -mx-4">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 ml-2"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide -mx-4 px-4"
        >
          {data?.items.map((brand) => (
            <div
              key={brand.id}
              onClick={() => router.push(`/shop?brand=${brand.slug}`)}
              className="bg-[#ffa4581a] rounded-lg flex-shrink-0 w-32 h-32 flex items-center justify-center p-4 cursor-pointer transition-transform transform hover:scale-105"
            >
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <span className="text-sm font-bold text-muted-foreground text-center">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 mr-2"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
