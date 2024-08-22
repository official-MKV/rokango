"use client";
import React, { useState, useMemo } from "react";
import { useAuth, useFirebaseQuery } from "@/hooks/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Switch } from "@/Components/ui/switch";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { format, differenceInHours } from "date-fns";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/Components/ui/badge";

const primaryColor = "#ffa459";

const NewTag = () => (
  <span className="bg-green-500 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded">
    NEW
  </span>
);

const OrderCard = ({ order, onToggleDelivered }) => {
  const isNew = differenceInHours(new Date(), order.date_ordered.toDate()) < 48;

  const handleToggle = (checked) => {
    if (!order.delivered) {
      onToggleDelivered(order.id, checked);
    }
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <Card className={`mb-4 min-w-[350px] ${order.delivered ? "bg-white" : ""}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm">
          <span>
            {isNew && <NewTag />}
            {order.id}
          </span>
          <div className="flex items-center space-x-2">
            {order.delivered ? (
              <Badge variant="success" className="bg-green-500 text-white">
                Delivered
              </Badge>
            ) : (
              <>
                <span className="text-xs">Not Delivered</span>
                <Switch
                  checked={order.delivered}
                  className="data-[state=unchecked]:bg-red-500"
                  onCheckedChange={handleToggle}
                />
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Ordered: {format(order.date_ordered.toDate(), "PPP")}
        </p>
        {order.delivery_date && (
          <p className="text-sm">
            Delivered: {format(order.delivery_date.toDate(), "PPP")}
          </p>
        )}
        <p className="text-sm truncate">Retailer: {order.retailer_name}</p>
        <p className="text-sm truncate">Location: {order.delivery_location}</p>
        <p className="text-sm font-semibold mt-2">Total: ₦{total.toFixed(2)}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-2 text-xs w-full"
              style={{ backgroundColor: primaryColor, color: "white" }}
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>Order ID:</strong>
                </p>
                <p>{order.id}</p>
                <p>
                  <strong>Date Created:</strong>
                </p>
                <p>{format(order.date_created.toDate(), "PPP")}</p>
                <p>
                  <strong>Date Ordered:</strong>
                </p>
                <p>{format(order.date_ordered.toDate(), "PPP")}</p>
                {order.delivery_date && (
                  <>
                    <p>
                      <strong>Delivery Date:</strong>
                    </p>
                    <p>{format(order.delivery_date.toDate(), "PPP")}</p>
                  </>
                )}
                <p>
                  <strong>Delivery Location:</strong>
                </p>
                <p>{order.delivery_location}</p>
                <p>
                  <strong>Retailer:</strong>
                </p>
                <p>{order.retailer_name}</p>
              </div>
              <h4 className="font-bold mt-4 mb-2">Items:</h4>
              <div className="bg-gray-100 p-2 rounded">
                <div className="grid grid-cols-12 gap-2 font-bold text-sm mb-1">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">QTY</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 text-sm border-t border-gray-200 py-1"
                  >
                    <div className="col-span-5">{item.name}</div>
                    <div className="col-span-2 text-center">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-right">
                      ₦{item.price.toFixed(2)}
                    </div>
                    <div className="col-span-3 text-right">
                      ₦{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-12 gap-2 text-sm font-bold mt-2 pt-2 border-t border-gray-300">
                  <div className="col-span-9 text-right">Total:</div>
                  <div className="col-span-3 text-right">
                    ₦{total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const OrdersPage = () => {
  const user = useAuth();
  const [filters, setFilters] = useState({ retailer_name: "", order_id: "" });
  const [showRecent, setShowRecent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;
  const {
    data: ordersData,
    isLoading,
    error,
  } = useFirebaseQuery("orders", {
    filters: { "supplier.id": user?.uid },
    page: currentPage,
    limit: itemsPerPage,
    searchField: "name",
    searchTerm: "",
  });
  const { items: orders, totalPages } = ordersData || {};
  const queryClient = useQueryClient();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter(
        (order) =>
          order.retailer.name
            .toLowerCase()
            .includes(filters.retailer_name.toLowerCase()) &&
          order.id.toLowerCase().includes(filters.order_id.toLowerCase())
      )
      .sort((a, b) => b.date_created.toDate() - a.date_created.toDate());
  }, [orders, filters]);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
        Orders
      </h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Filter by Retailer"
          name="retailer_name"
          value={filters.retailer_name}
          onChange={handleFilterChange}
          className="flex-grow"
        />
        <Input
          placeholder="Filter by Order ID"
          name="order_id"
          value={filters.order_id}
          onChange={handleFilterChange}
          className="flex-grow"
        />
        <Button
          onClick={() => setFilters({ retailer_name: "", order_id: "" })}
          style={{ backgroundColor: primaryColor }}
        >
          Clear Filters
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center p-4">Loading orders...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">
          Error: {error.message}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onToggleDelivered={handleToggleDelivered}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
