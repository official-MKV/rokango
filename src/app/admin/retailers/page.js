"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Skeleton } from "@/Components/ui/skeleton";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useFirebaseQuery } from "@/hooks/firebase";

export default function RetailersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const router = useRouter();

  const {
    data: retailersData,
    isLoading,
    error,
  } = useFirebaseQuery("users", {
    filters: { role: "retailer" },
    page: currentPage,
    limit: itemsPerPage,
    searchField: "name",
    searchTerm: searchTerm,
  });

  const { items: retailers, totalPages } = retailersData || {};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRowClick = (retailerId) => {
    router.push(`/admin/retailers/${retailerId}`);
  };

  const handleAddRetailer = () => {
    router.push("/admin/retailers/addNew");
  };

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Retailers</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          placeholder="Search retailers..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:max-w-xs"
        />
        <Button
          onClick={handleAddRetailer}
          className="bg-[#ffa459] w-full sm:w-auto"
        >
          Add Retailer
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Business Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="w-full h-[50px] rounded-[5px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : retailers && retailers.length > 0 ? (
              retailers.map((retailer) => (
                <TableRow
                  key={retailer.id}
                  onClick={() => handleRowClick(retailer.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="whitespace-nowrap">
                    {retailer.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {retailer.businessName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {retailer.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {retailer.phone}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No retailers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Add pagination controls here if needed */}
    </div>
  );
}
