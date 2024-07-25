"use client";

import React, { useState } from "react";

const SettingsPage = () => {
  const [profile] = useState({
    businessName: "Sunny Side Café",
    businessLocation: "123 Main St, Sunnyville, CA 90210",
    phoneNumber: "(555) 123-4567",
    ownerName: "Jane Doe",
    businessLogo: "https://placekitten.com/200/200", // Placeholder image
  });

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-[#ffa459]">
        Business Profile
      </h1>

      <div className="space-y-4 w-full flex flex-wrap space-x-9 md:items-center   md:divide-x-2">
        {profile.businessLogo && (
          <div className="flex justify-center mb-12">
            <img
              src={profile.businessLogo}
              alt="Business Logo"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2 md:px-[20px]">
          <h2 className="text-2xl font-semibold text-[#ffa459]">
            Business Name
          </h2>
          <p className="text-xl text-gray-600">{profile.businessName}</p>
        </div>
        <div className="space-y-2  md:px-[20px]">
          <h2 className="text-2xl font-semibold text-[#ffa459]">
            Business Location
          </h2>
          <p className="text-xl text-gray-600">{profile.businessLocation}</p>
        </div>
        <div className="space-y-2  md:px-[20px]">
          <h2 className="text-2xl font-semibold text-[#ffa459]">
            Phone Number
          </h2>
          <p className="text-xl text-gray-600">{profile.phoneNumber}</p>
        </div>
        <div className="space-y-2  md:px-[20px] ">
          <h2 className="text-2xl font-semibold text-[#ffa459]">
            Business Owner Name
          </h2>
          <p className="text-xl text-gray-600 ">{profile.ownerName}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
