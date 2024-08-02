"use client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();
  const push = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-[#ffa459]">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
      <Button
        className="bg-[#ffa459] hover:bg-[#ff8c29] text-white"
        onClick={push}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Back to Shopping
      </Button>
    </div>
  );
};

export default Custom404;
