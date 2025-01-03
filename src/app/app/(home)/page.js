"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/ui/use-toast";
import { useAuth } from "@/hooks/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductRow from "@/Components/ProductRow";
import { Button } from "@/Components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingPage from "@/Components/LoadingPage";
import CategoryRow from "@/Components/CategoryRow";
import BrandRow from "@/Components/BrandRow";

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
    <div className="grid grid-cols-1 gap-8 md:gap-12 w-full">
      <section className="w-full h-[50vh] md:h-[60vh] relative">
        <div className="absolute inset-0">
          <img
            src="/FMCG.png"
            alt="Background"
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#ffa458] via-[#ffa458]/70 to-transparent"
            style={{ backdropFilter: "brightness(0.9)" }}
          />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-end justify-center pb-8 md:pb-16">
            <div className="max-w-2xl text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
                Connecting Retailers with the Best Local Suppliers
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 text-white/95">
                Get the best products at the best prices from local suppliers
                with fast deliveries and unmatched customer support.
              </p>
              <button
                onClick={() => (window.location.href = "/shop")}
                className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-medium text-[#ffa458] bg-white hover:bg-white/90 transition-colors rounded-lg shadow-lg hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:gap-12">
            <ProductRow
              title="Sponsored Products"
              tableName="products"
              filters={{ sponsored: true }}
              itemsToShow={4}
            />

            <CategoryRow
              title="All Categories"
              tableName="categories"
              itemsToShow={8}
            />

            <ProductRow
              title="Foods and Beverages"
              categoryId="food_and_beverages"
              itemsToShow={4}
            />

            <ProductRow
              title="Top Selling Products"
              tableName="products"
              filters={{ topSelling: true }}
              itemsToShow={4}
            />
            <BrandRow title="Featured Brands" itemsToShow={6} />

            {/* <ProductRow
              title="Group Buy in Your Area"
              tableName="group_buys"
              itemsToShow={4}
            /> */}
          </div>
        </div>
      </section>
    </div>
  );
}
