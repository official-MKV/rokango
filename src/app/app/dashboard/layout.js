"use client";
import React from "react";
import SideBar from "@/Components/SideBar";
import withRoleGuard from "@/app/HOC";

import { useAuth } from "@/hooks/firebase";

function DashboardLayout({ children }) {
  const { user } = useAuth();
  const isSidebarDisabled =
    user?.role === "supplier" &&
    (!user.status || user.status !== "approved" || !user.active);

  return (
    <div className=" flex min-h-screen relative ">
      <SideBar disabled={isSidebarDisabled} />
      <main className="flex-1 p-4 lg:ml-64 relative lg:mb-4 mb-[100px]">
        {children}
      </main>
    </div>
  );
}

export default withRoleGuard(DashboardLayout, ["supplier", "admin"]);
