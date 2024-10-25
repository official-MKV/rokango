"use client";
import React from "react";
import { Button } from "@/Components/ui/button";

const Page = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      Rokango Landing Page
      <Button
        className="bg-[#ffa458]"
        onClick={() => {
          window.location.href = "http://app.localhost:3000";
        }}
      >
        Go to App
      </Button>
    </div>
  );
};

export default Page;
