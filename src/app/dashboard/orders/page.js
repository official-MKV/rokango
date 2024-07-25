"use client";
import React, { useState, useMemo } from "react";
import { useFirebaseQuery } from "@/hooks/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, differenceInHours } from "date-fns";

const primaryColor = "#ffa459";

const NewTag = () => (
  <span className="bg-green-500 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded">
    NEW
  </span>
);

const OrderCard = ({ order, onToggleDelivered }) => {
  const isNew = differenceInHours(new Date(), order.date_ordered.toDate()) < 48;

  const handleToggle = (checked) => {
    onToggleDelivered(order.order_id, checked);
    //
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <Card className={`mb-4 ${order.delivered ? "bg-green-50" : ""}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm">
          <span>
            {isNew && <NewTag />}
            {order.order_id}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              {order.delivered ? "Delivered" : "Not Delivered"}
            </span>
            <Switch
              checked={order.delivered}
              className="data-[state=checked]:bg-green-500"
              onCheckedChange={handleToggle}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{format(order.date_ordered.toDate(), "PPP")}</p>
        <p className="text-sm truncate">{order.retailer_name}</p>
        <p className="text-sm truncate">{order.delivery_location}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-2 text-xs"
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
                <p>{order.order_id}</p>
                <p>
                  <strong>Date Created:</strong>
                </p>
                <p>{format(order.date_created.toDate(), "PPP")}</p>
                <p>
                  <strong>Date Ordered:</strong>
                </p>
                <p>{format(order.date_ordered.toDate(), "PPP")}</p>
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
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="col-span-3 text-right">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-12 gap-2 text-sm font-bold mt-2 pt-2 border-t border-gray-300">
                  <div className="col-span-9 text-right">Total:</div>
                  <div className="col-span-3 text-right">
                    ${total.toFixed(2)}
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
  const [filters, setFilters] = useState({ retailer_name: "", order_id: "" });
  const [showRecent, setShowRecent] = useState(false);
  const { data: orders, isLoading, error } = useFirebaseQuery("orders");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter(
        (order) =>
          order.retailer_name
            .toLowerCase()
            .includes(filters.retailer_name.toLowerCase()) &&
          order.order_id.toLowerCase().includes(filters.order_id.toLowerCase())
      )
      .sort((a, b) =>
        showRecent ? b.date_ordered.toDate() - a.date_ordered.toDate() : 0
      );
  }, [orders, filters, showRecent]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleDelivered = async (orderId, isDelivered) => {
    // Implement the logic to update the order status in Firebase
    console.log(
      `Order ${orderId} marked as ${
        isDelivered ? "delivered" : "not delivered"
      }`
    );
    // You would typically update the Firestore document here
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
          onClick={() => setShowRecent(!showRecent)}
          style={{ backgroundColor: showRecent ? primaryColor : undefined }}
        >
          {showRecent ? "Show All" : "Show Recent"}
        </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.order_id}
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
