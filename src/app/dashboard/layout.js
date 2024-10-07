"use client";
import React from "react";
import SideBar from "@/Components/SideBar";
import withRoleGuard from "../HOC";

function DashboardLayout({ children }) {
  return (
    <div className=" flex min-h-screen relative ">
      <SideBar />
      <main className="flex-1 p-4 lg:ml-64 relative lg:mb-4 mb-[100px]">
        {children}
      </main>
    </div>
  );
}

export default withRoleGuard(DashboardLayout, ["supplier", "admin"]);
