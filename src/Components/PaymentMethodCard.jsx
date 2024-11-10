import React from "react";
import { cn } from "@/lib/utils";

export default function PaymentMethodCard({ method, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(method.id)}
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all",
        selected ? "border-orange-500 bg-orange-50" : "border-gray-200",
        method.available
          ? "hover:border-orange-300"
          : "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-3">
        <method.icon
          className={cn(
            "w-6 h-6",
            selected ? "text-orange-500" : "text-gray-600"
          )}
        />
        <div>
          <h4 className="font-medium">{method.name}</h4>
          <p className="text-sm text-gray-600">{method.description}</p>
        </div>
      </div>
    </div>
  );
}
