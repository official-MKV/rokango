"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/ui/use-toast";
import { useAuth } from "@/hooks/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductRow } from "@/Components/ProductRow";
import { Button } from "@/Components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingPage from "@/Components/LoadingPage";
import { CategoryRow } from "@/Components/CategoryRow";
import { BrandRow } from "@/Components/BrandRow";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verify = urlParams.get("verify");
      const reference = urlParams.get("reference");
      if (verify === "true" && reference) {
        setIsVerifying(true);
        try {
          const checkPaymentStatus = async () => {
            const transactionRef = doc(db, "transactions", reference);
            const transactionSnap = await getDoc(transactionRef);

            if (transactionSnap.exists()) {
              const transactionData = transactionSnap.data();

              if (transactionData.status === "success") {
                toast({
                  title: "Payment Successful",
                  description: "You can track your order on the orders page.",
                  duration: 5000,
                });
                setIsVerifying(false);
              } else if (transactionData.status === "pending") {
                setTimeout(checkPaymentStatus, 5000);
              } else {
                throw new Error("Payment failed");
              }
            } else {
              throw new Error("Transaction not found");
            }
          };

          await checkPaymentStatus();
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast({
            title: "Error",
            description:
              "There was an error verifying your payment. Please contact support.",
            variant: "destructive",
            duration: 5000,
          });
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();
  }, [router, toast]);

  if (loading || isVerifying) {
    return <LoadingPage />;
  }

  return (
    <div className=" relative w-full flex flex-col gap-12">
      <section className="bg-[#faf0e4] py-16 relative w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Connecting Retailers with the Best Local Suppliers
              </h1>
              <p className="text-lg mb-6">
                Get the best products at the best prices from local suppliers
                with fast deliveries and unmatched customer support.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/shop")}
                className="bg-primary hover:bg-primary/90"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-1/2">
              <img src="/hero-img.png" alt="Hero" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <div className="container  px-4 space-y-12">
        <BrandRow title="Featured Brands" itemsToShow={6} />
        <CategoryRow
          title="All Categories"
          tableName="categories"
          itemsToShow={8}
        />

        <ProductRow
          title="Electronics"
          categoryId="c51b35fe-85e0-4826-9196-cb038c0c74d3"
          itemsToShow={4}
        />

        <ProductRow
          title="Sponsored Products"
          tableName="products"
          filters={{ sponsored: true }}
          itemsToShow={4}
        />

        <ProductRow
          title="Top Selling Products"
          tableName="products"
          filters={{ topSelling: true }}
          itemsToShow={4}
        />

        <ProductRow
          title="Group Buy in Your Area"
          tableName="group_buys"
          itemsToShow={4}
        />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Featured Retailers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Retailer {index + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
