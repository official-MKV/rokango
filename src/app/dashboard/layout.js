"use client";
import React from "react";
import SideBar from "@/Components/SideBar";
import withRoleGuard from "../HOC";
const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-full pt-[50px]">
      <div className="md:w-[350px] w-0" />
      <SideBar />
      <div className="flex-1 h-full px-[20px] md:px-0">{children}</div>
    </div>
  );
};

export default withRoleGuard(Layout, ["supplier"]);
