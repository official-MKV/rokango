"use client";
import React from "react";
import withRoleGuard from "../HOC";
import { useAuth } from "@/hooks/firebase";

const page = () => {
  const { user } = useAuth();

  return <div></div>;
};

export default page;
