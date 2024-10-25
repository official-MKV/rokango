"use client";
import React from "react";

import { useEffect } from "react";
import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/inventory");
  }, [router.isReady]);

  return <div></div>;
};

export default page;
