"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Sample data
const orders = [
  {
    id: "ORD001",
    expectedDeliveryDate: "2024-07-30",
    dateOrdered: "2024-07-22",
    itemsDelivered: 3,
    totalItems: 5,
    status: "pending",
    totalPrice: 250.99,
    items: [
      {
        name: "Item 1",
        supplier: "Supplier A",
        delivered: true,
        quantity: 2,
        price: 50.99,
      },
      {
        name: "Item 2",
        supplier: "Supplier B",
        delivered: false,
        quantity: 1,
        price: 30.0,
      },
      {
        name: "Item 3",
        supplier: "Supplier C",
        delivered: true,
        quantity: 3,
        price: 40.0,
      },
      {
        name: "Item 4",
        supplier: "Supplier A",
        delivered: false,
        quantity: 1,
        price: 20.0,
      },
      {
        name: "Item 5",
        supplier: "Supplier B",
        delivered: true,
        quantity: 2,
        price: 35.0,
      },
    ],
  },
  {
    id: "ORD002",
    expectedDeliveryDate: "2024-08-05",
    dateOrdered: "2024-07-25",
    itemsDelivered: 2,
    totalItems: 3,
    status: "successful",
    totalPrice: 150.5,
    items: [
      {
        name: "Item A",
        supplier: "Supplier X",
        delivered: true,
        quantity: 1,
        price: 70.5,
      },
      {
        name: "Item B",
        supplier: "Supplier Y",
        delivered: true,
        quantity: 2,
        price: 40.0,
      },
      {
        name: "Item C",
        supplier: "Supplier Z",
        delivered: false,
        quantity: 1,
        price: 40.0,
      },
    ],
  },
  {
    id: "ORD003",
    expectedDeliveryDate: "2024-07-28",
    dateOrdered: "2024-07-20",
    itemsDelivered: 4,
    totalItems: 4,
    status: "completed",
    totalPrice: 320.0,
    items: [
      {
        name: "Item X",
        supplier: "Supplier P",
        delivered: true,
        quantity: 2,
        price: 80.0,
      },
      {
        name: "Item Y",
        supplier: "Supplier Q",
        delivered: true,
        quantity: 1,
        price: 60.0,
      },
      {
        name: "Item Z",
        supplier: "Supplier R",
        delivered: true,
        quantity: 3,
        price: 50.0,
      },
      {
        name: "Item W",
        supplier: "Supplier S",
        delivered: true,
        quantity: 1,
        price: 30.0,
      },
    ],
  },
  // Add more sample orders here as needed
];

const OrderCard = ({ order }) => {
  const statusColor = {
    pending: "bg-yellow-200 text-yellow-700",
    successful: "bg-green-200 text-green-700",
    completed: "bg-blue-200 text-blue-700",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full max-w-sm cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order {order.id}</span>
              <Badge className={statusColor[order.status]}>
                {order.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="font-light text-[12px]">
            <p>
              Expected Delivery:{" "}
              <span className=" font-medium">{order.expectedDeliveryDate}</span>{" "}
            </p>
            <p>
              Date Ordered:
              <span className=" font-medium">{order.dateOrdered}</span>{" "}
            </p>
            <p>
              Progress:{" "}
              <span className=" font-medium">
                {order.itemsDelivered}/{order.totalItems} items delivered
              </span>
            </p>
            <p className="font-semibold mt-2 ">
              Total Price:{" "}
              <span className="text-[#ffa459] text-[15px]">
                ₦{order.totalPrice.toFixed(2)}
              </span>
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Items:</h4>
          <ul>
            {order.items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span className="">
                  {item.name} - {item.supplier} (Qty: {item.quantity})
                </span>
                <div className="text-right">
                  <p> ₦{item.price.toFixed(2)}</p>
                  <Badge
                    className={
                      item.delivered
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }
                  >
                    {item.delivered ? "Delivered" : "Pending"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
          <p className="font-semibold mt-4">
            Total Price: ₦{order.totalPrice.toFixed(2)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OrderDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter((order) =>
      order.id.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="min-h-screen " style={{ "--primary-color": "#ffa459" }}>
      <div className=" top-0 left-0 right-0 bg-white z-10 p-6">
        <h1 className="text-3xl font-bold mb-6 text-[var(--primary-color)]">
          Order Dashboard
        </h1>
        <div className=" flex">
          <Input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
          />
          <Button className="bg-[var(--primary-color)] hover:bg-[#ff9045]">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>
      <div className=" p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
