import React from "react";
import { MapPin, Phone, User } from "lucide-react";

export default function AddressConfirmation({ address }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p className="font-medium">{address.fullName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p>{address.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p>{address.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
