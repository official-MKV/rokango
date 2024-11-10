"use client";
import React, { useState } from "react";
import { CreditCard, Truck, Clock, AlertCircle, Wallet } from "lucide-react";
import PaymentMethodCard from "./PaymentMethodCard";
import AddressConfirmation from "./AddressConfirmation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

const paymentMethods = [
  {
    id: "paystack",
    name: "Paystack",
    icon: CreditCard,
    available: true,
    description: "Pay securely with your card via Paystack",
  },
  {
    id: "pay-on-delivery",
    name: "Pay on Delivery",
    icon: Truck,
    available: true,
    description: "Pay cash when your order arrives",
  },
  {
    id: "opay",
    name: "OPay",
    icon: Wallet,
    available: false,
    description: "Coming soon - Pay with your OPay wallet",
  },
  {
    id: "almond",
    name: "Almond",
    icon: Wallet,
    available: false,
    description: "Coming soon - Pay with Almond",
  },
  {
    id: "fairmoney",
    name: "Buy Now, Pay Later",
    icon: Clock,
    available: false,
    description: "Coming soon - Buy on Credit with FairMoney",
  },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  address,
  amount,
  handlePaystack,
}) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(false);

  const handleMethodSelect = (methodId) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (!method?.available) {
      setShowUnavailableAlert(true);
      setTimeout(() => setShowUnavailableAlert(false), 3000);
      return;
    }
    setSelectedMethod(methodId);
  };

  const handleConfirm = () => {
    if (!selectedMethod) return;
    onConfirm(selectedMethod);
  };

  const handleClose = () => {
    onClose();
    setSelectedMethod("");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          handleClose();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] mt-8 overflow-hidden">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto pr-2 h-[calc(70vh-180px)]">
            {" "}
            {/* Changed from 60% to calc */}
            <AddressConfirmation address={address} />
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedMethod === method.id}
                    onSelect={handleMethodSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {" "}
              {/* Added mb-4 for spacing */}
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedMethod}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {selectedMethod === "pay-on-delivery"
                ? "Place Order"
                : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showUnavailableAlert && (
        <Alert variant="warning" className="fixed top-4 right-4 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This payment method is coming soon!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
