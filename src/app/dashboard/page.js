"use client";
import React from "react";
import { useAuth } from "@/hooks/firebase";

const page = () => {
  const { user } = useAuth();
  console.log(user);
  return <div></div>;
};

export default page;
