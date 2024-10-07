"use client";

import React, { useState, useCallback } from "react";
import { useAuth, useFirebaseQuery } from "@/hooks/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Download, Search, X, CircleCheck } from "lucide-react";
import { format, differenceInHours } from "date-fns";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";

const NewTag = () => (
  <Badge variant="secondary" className="bg-green-500 text-white text-[10px]">
    NEW
  </Badge>
);

const OrderCard = ({ order, onToggleDelivered }) => {
  const isNew = differenceInHours(new Date(), order.created_at.toDate()) < 48;

  const handleToggle = (checked) => {
    if (!order.delivered) {
      onToggleDelivered(order.id, checked);
    }
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const downloadOrderDetails = () => {
    const orderDetails = `
Order ID: ${order.id}
Date Created: ${format(order.created_at.toDate(), "PPP")}
Date Ordered: ${format(order.created_at.toDate(), "PPP")}
${
  order.delivery_date
    ? `Delivery Date: ${format(order.delivery_date.toDate(), "PPP")}`
    : ""
}
Delivery Location: ${order.delivery_location}
Retailer: ${order.retailer.name}

Items:
${order.items
  .map(
    (item) =>
      `${item.name} - Quantity: ${item.quantity}, Price: ₦${item.price.toFixed(
        2
      )}, Subtotal: ₦${(item.quantity * item.price).toFixed(2)}`
  )
  .join("\n")}

Total: ₦${total.toFixed(2)}
    `.trim();

    const blob = new Blob([orderDetails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-3">
        <CardTitle className="flex justify-between items-center text-xs flex-wrap">
          <span className="flex items-center gap-1 text-gray-700">
            {isNew && <NewTag />}
            {order.id}
          </span>
          <div className="flex items-center space-x-1 ">
            {order.delivered ? (
              <Badge variant="success" className="text-[10px] ">
                Delivered
                <CircleCheck
                  className=" size-[15px] ml-2 text-[white]"
                  fill="#4bee4b"
                />
              </Badge>
            ) : (
              <>
                <span className="text-[10px] text-gray-500">Not Delivered</span>
                <Switch
                  checked={order.delivered}
                  onCheckedChange={handleToggle}
                />
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <p className="text-gray-500">Ordered:</p>
          <p>{format(order.created_at.toDate(), "PP")}</p>
          {order.delivery_date && (
            <>
              <p className="text-gray-500">Delivered:</p>
              <p>{format(order.delivery_date.toDate(), "PP")}</p>
            </>
          )}
          <p className="text-gray-500">Retailer:</p>
          <p className="truncate">{order.retailer.name}</p>
          <p className="text-gray-500">Location:</p>
          <p className="truncate">{order.delivery_location}</p>
          <p className="text-gray-500">Total:</p>
          <p className="font-semibold">₦{total.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-[10px]">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Order ID:</p>
                  <p>{order.id}</p>
                  <p className="text-gray-500">Date Created:</p>
                  <p>{format(order.created_at.toDate(), "PPP")}</p>
                  <p className="text-gray-500">Date Ordered:</p>
                  <p>{format(order.created_at.toDate(), "PPP")}</p>
                  {order.delivery_date && (
                    <>
                      <p className="text-gray-500">Delivery Date:</p>
                      <p>{format(order.delivery_date.toDate(), "PPP")}</p>
                    </>
                  )}
                  <p className="text-gray-500">Delivery Location:</p>
                  <p>{order.delivery_location}</p>
                  <p className="text-gray-500">Retailer:</p>
                  <p>{order.retailer.name}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Items:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">QTY</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₦{item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ₦{(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₦{total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadOrderDetails}
            className="text-[10px]"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ retailer_name: "", order_id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const {
    data: ordersData,
    isLoading,
    error,
  } = useFirebaseQuery("orders", {
    filters: { supplier: user?.uid },
    page: currentPage,
    pageSize,
    searchField: "name",
    searchTerm: "",
  });
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { items: orders, totalPages } = ordersData || {
    items: [],
    totalPages: 0,
  };
  const queryClient = useQueryClient();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleDelivered = async (orderId, isDelivered) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        delivered: isDelivered,
        delivery_date: isDelivered ? serverTimestamp() : null,
      });
      queryClient.invalidateQueries(["orders"]);
      console.log(
        `Order ${orderId} marked as ${
          isDelivered ? "delivered" : "not delivered"
        }`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.retailer.name
        .toLowerCase()
        .includes(filters.retailer_name.toLowerCase()) &&
      order.id.toLowerCase().includes(filters.order_id.toLowerCase())
  );

  return (
    <div className="container mx-auto pb-20 lg:pb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders</h1>
      <div className="sticky top-0 bg-white z-10 py-3 mb-4 border-b">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Filter by Retailer"
              name="retailer_name"
              value={filters.retailer_name}
              onChange={handleFilterChange}
              className="pl-8 text-sm"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="relative flex-grow">
            <Input
              placeholder="Filter by Order ID"
              name="order_id"
              value={filters.order_id}
              onChange={handleFilterChange}
              className="pl-8 text-sm"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button
            onClick={() => setFilters({ retailer_name: "", order_id: "" })}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">
          Error: {error.message}
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 justify-center">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onToggleDelivered={handleToggleDelivered}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <Button
                className="bg-[#ffa458]"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-4 text-gray-500 bg-gray-100 rounded-md">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
