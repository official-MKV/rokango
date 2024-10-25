"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  UserPlus,
  SlidersHorizontal,
  Search,
  Plus,
  Clock,
} from "lucide-react";
import { useFirebaseQuery } from "@/hooks/firebase";

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    approvalStatus: "all", // all, approved, pending
    activeStatus: "all", // all, active, inactive
  });
  const itemsPerPage = 10;
  const router = useRouter();

  const {
    data: suppliersData,
    isLoading,
    error,
  } = useFirebaseQuery("users", {
    filters: {
      role: "supplier",
      ...(filters.approvalStatus !== "all" && {
        approved: filters.approvalStatus === "approved",
      }),
      ...(filters.activeStatus !== "all" && {
        active: filters.activeStatus === "active",
      }),
    },
    page: currentPage,
    limit: itemsPerPage,
    searchField: "name",
    searchTerm: searchTerm,
  });

  const { items: suppliers, totalPages } = suppliersData || {};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (supplierId) => {
    router.push(`/admin/suppliers/${supplierId}`);
  };

  const handleAddSupplier = () => {
    router.push("/admin/suppliers/addNew");
  };

  const getApprovalBadge = (supplier) => {
    return supplier.status === "approved" ? (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 hover:bg-green-200"
      >
        Approved
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      >
        Pending Approval
      </Badge>
    );
  };

  const getActiveStatus = (supplier) => {
    return supplier.active ? (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <span className="text-green-700">Active</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="text-red-700">Inactive</span>
      </div>
    );
  };

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button
          onClick={handleAddSupplier}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Approval Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.approvalStatus === "all"}
              onCheckedChange={() =>
                setFilters({ ...filters, approvalStatus: "all" })
              }
            >
              All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.approvalStatus === "approved"}
              onCheckedChange={() =>
                setFilters({ ...filters, approvalStatus: "approved" })
              }
            >
              Approved
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.approvalStatus === "pending"}
              onCheckedChange={() =>
                setFilters({ ...filters, approvalStatus: "pending" })
              }
            >
              Pending Approval
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Active Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.activeStatus === "all"}
              onCheckedChange={() =>
                setFilters({ ...filters, activeStatus: "all" })
              }
            >
              All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.activeStatus === "active"}
              onCheckedChange={() =>
                setFilters({ ...filters, activeStatus: "active" })
              }
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.activeStatus === "inactive"}
              onCheckedChange={() =>
                setFilters({ ...filters, activeStatus: "inactive" })
              }
            >
              Inactive
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Business Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Phone</TableHead>
              <TableHead className="whitespace-nowrap">
                Approval Status
              </TableHead>
              <TableHead className="whitespace-nowrap">Active Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full h-[50px] rounded-[5px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  onClick={() => handleRowClick(supplier.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="whitespace-nowrap font-medium">
                    {supplier.name}
                    {supplier.isNew && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-blue-100 text-blue-800"
                      >
                        New
                      </Badge>
                    )}
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
                    {getApprovalBadge(supplier)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getActiveStatus(supplier)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center text-gray-500">
                    <UserPlus className="h-12 w-12 mb-2" />
                    <p className="text-lg font-medium">No Suppliers found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
