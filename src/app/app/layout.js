"use client";
import React from "react";
import Navbar from "@/Components/AdminNavBar";
import withRoleGuard from "@/app/HOC";

const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-full  ">
      {/* <div className="md:w-[350px] w-0" />
      <Navbar /> */}
      <main className="flex-1  h-full  md:px-0  relative  ">{children}</main>
    </div>
  );
};

export default withRoleGuard(Layout, ["admin", "supplier", "retailer"]);
