"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: suppliers,
    isLoading,
    error,
  } = useFirebaseQuery("users", {
    role: "supplier",
    name: { value: searchTerm, matchType: "contains" },
  });
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (supplierId) => {
    router.push(`/admin/suppliers/${supplierId}`);
  };

  const handleAddSupplier = () => {
    router.push("/admin/suppliers/addNew");
  };

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:max-w-xs"
        />
        <Button
          onClick={handleAddSupplier}
          className="bg-[#ffa459] w-full sm:w-auto"
        >
          Add Supplier
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
              <TableHead className="whitespace-nowrap">Active</TableHead>
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
            ) : suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  onClick={() => handleRowClick(supplier.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="whitespace-nowrap">
                    {supplier.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {supplier.businessName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {supplier.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {supplier.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {supplier.active ? "✅" : "❌"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No Suppliers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
