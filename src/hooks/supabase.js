import { useQuery } from "@tanstack/react-query";
export function useSupabaseQuery(tableName, options = {}) {
  const {
    filters = {},
    page = 1,
    pageSize = 20,
    searchField,
    searchTerm,
    orderByField = "created_at",
    orderDirection = "desc",
    relations = [], // New option for specifying related tables
  } = options;

  return useQuery({
    queryKey: [
      tableName,
      filters,
      page,
      pageSize,
      searchField,
      searchTerm,
      orderByField,
      orderDirection,
      relations, // Include relations in the query key
    ],
    queryFn: async () => {
      const response = await fetch("/api/supabase-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName,
          filters,
          page,
          pageSize,
          searchField,
          searchTerm,
          orderByField,
          orderDirection,
          relations, // Send relations to the API
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
