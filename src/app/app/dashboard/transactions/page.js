"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

const useFirebaseQuery = () => {
  // Mock data for demonstration
  return {
    wallet: 5000,
    analytics: [
      { name: "Jan", value: 4000 },
      { name: "Feb", value: 3000 },
      { name: "Mar", value: 5000 },
      { name: "Apr", value: 4500 },
      { name: "May", value: 6000 },
    ],
    transactions: [
      { id: 1, date: "2023-05-01", amount: 500, status: "Completed" },
      { id: 2, date: "2023-05-03", amount: 750, status: "Completed" },
      { id: 3, date: "2023-05-05", amount: 1000, status: "Pending" },
      { id: 4, date: "2023-05-07", amount: 250, status: "Completed" },
      { id: 5, date: "2023-05-09", amount: 800, status: "Completed" },
    ],
  };
};

const SupplierTransactionPage = () => {
  const { wallet, analytics, transactions } = useFirebaseQuery();
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCashOut = () => {
    console.log("Cashing out...");
    // Implement cash out logic here
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[black]">Transactions</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="border-[gray]/20 border-[1px]">
          <CardHeader>
            <CardTitle className="flex items-center text-[black]">
              <Wallet className="mr-2" /> Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦{wallet.toFixed(2)}</p>
            <Button
              onClick={handleCashOut}
              className="mt-4 bg-[#ffa459] hover:bg-[#ff8c29]"
            >
              Cash Out
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[gray]/20 border-[1px]">
          <CardHeader>
            <CardTitle className="text-[#ffa459]">Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ffa459" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle className="text-[#ffa459]">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="">
                  <CardContent className="p-4">
                    <p className="font-bold text-[#ffa459]">
                      {transaction.date}
                    </p>
                    <p className="flex justify-between items-center">
                      Amount:{" "}
                      <span className="font-bold">₦{transaction.amount}</span>
                    </p>
                    <p className="flex justify-between items-center">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          transaction.status === "Completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#ffa459]">Date</TableHead>
                  <TableHead className="text-[#ffa459]">Amount</TableHead>
                  <TableHead className="text-[#ffa459]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>₦{transaction.amount}</TableCell>
                    <TableCell
                      className={
                        transaction.status === "Completed"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {transaction.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierTransactionPage;
