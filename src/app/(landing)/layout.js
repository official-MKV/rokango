"use client";
import React from "react";
import { Button } from "@/Components/ui/button";
import Footer from "@/Components/Footer";

const layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-orange-100 flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <img
            className="w-36 hover:opacity-90 transition-opacity"
            src="/rokango.png"
            alt="Rokango Logo"
          />
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors"
          >
            Products
          </a>
          <a
            href="/about-us"
            className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors"
          >
            About Us
          </a>
          <a
            href="#"
            className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              const { protocol, host } = window.location;

              const cleanedHost = host.startsWith("www.")
                ? host.slice(4)
                : host;

              const baseUrl = `app.${cleanedHost}`;

              window.location.href = `${protocol}//${baseUrl}/register`;
            }}
            className="bg-[#ffa458] hover:bg-[#fc8e33] shadow-lg shadow-orange-200/50 transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>
      </nav>
      <div>{children}</div>

      <Footer />
    </div>
  );
};

export default layout;
