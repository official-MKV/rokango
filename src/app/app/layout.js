"use client";
import React from "react";
import Navbar from "@/Components/AdminNavBar";
import withRoleGuard from "@/app/HOC";

const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-full pt-[50px]">
      {/* <div className="md:w-[350px] w-0" />
      <Navbar /> */}
      <main className="flex-1  h-full px-[20px] md:px-0  relative mb-[200px] md:mb-[100px]">
        {children}
      </main>
    </div>
  );
};

export default withRoleGuard(Layout, ["admin", "supplier", "retailer"]);
