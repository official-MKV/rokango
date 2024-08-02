"use client";
import React from "react";
import { MagicCard } from "@/Components/magicui/magic-card";
import value from "@/data/valueProposition.json";
import { ShoppingCart, Package, Shield } from "lucide-react";
import { useEffect } from "react";
import ShoppingSection from "../../Components/ShoppingSection";
import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/ui/use-toast";
import Verified from "@/Components/Verified";
import { Button } from "@/Components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Marquee from "@/Components/magicui/marquee";

const page = () => {
  const icons = {
    ShoppingCart,
    Package,
    Shield,
  };
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  useEffect(() => {
    const verifyPayment = async () => {
      const { verify, reference } = router.query;

      if (verify === "true" && reference) {
        try {
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

              // Wait for a short time to ensure the toast is visible before redirecting
              setTimeout(() => {
                router.push("/profile/orders");
              }, 2000);
            } else {
              toast({
                title: "Payment Unsuccessful",
                description:
                  "There was an issue with your payment. Please try again.",
                variant: "destructive",
                duration: 5000,
              });
            }
          } else {
            throw new Error("Transaction not found");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast({
            title: "Error",
            description:
              "There was an error verifying your payment. Please contact support.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    };

    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <div className=" flex flex-col  gap-[50px]">
        <section
          id="hero__Banner"
          className="w-full md:h-[50vh] h-[70vh] overflow-hidden  bg-[#faf0e4] flex flex-col md:flex-row md:px-[30px] px-[10px] py-[20px] md:py-[30px]"
        >
          <div className="md:w-1/2 w-full h-full relative text-wrap flex flex-col gap-4">
            <div className="w-full gap-2 relative text-center flex flex-col items-center justify-center ">
              <p className="md:text-5xl text-3xl font-bold leading-tight ">
                Connect Directly with Manufacturers & Local Suppliers
              </p>
              <p className="md:w-[80%] w-full text-[15px] font-light">
                Streamline your supply chain and discover quality products at
                competitive prices.
              </p>
            </div>

            <div className=" w-full flex items-center justify-center">
              <div
                onClick={() => {
                  window.location.href = "/shop";
                }}
                className="font-medium mt-[10px] px-[20px] py-[10px] bg-[#ffa459] text-[white] cursor-pointer hover:bg-[#ff8f33] hover:rounded-[10px] transition-all duration-500 ease-in-out"
              >
                Shop Now
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full   relative ">
            <div className="relative w-full h-full items-center justify-center mb-[100px]">
              <img
                src="/heroimg.png"
                className="relative w-full h-full"
                style={{ objecFit: "contain" }}
              />
            </div>
          </div>
        </section>
        <section id="value__Proposition">
          <div className="md:flex hidden w-full   flex-wrap items-center justify-center  gap-[10px] md:gap-[50px] px-[10px]">
            {value.map((item) => {
              const IconComponent = icons[item.icon];
              return (
                <MagicCard
                  className=" md:size-[300px] w-full md:relative   cursor-pointer flex-col  shadow-2xl flex items-center justify-center   py-[30px] px-[30px]"
                  gradientColor={"#ffa459"}
                  gradientSize={100}
                  gradientOpacity={50}
                  gradientTransparency={50}
                >
                  <div className="h-full w-full flex flex-col gap-10">
                    <div className="size-[50px] rounded-full bg-[#faf0e4] flex items-center justify-center">
                      <IconComponent className="text-[#fbd4a5] size-[30px] " />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <p className="text-[15px] font-bold">{item.title}</p>
                      <p className="text-[12px] font-light">
                        {" "}
                        {item.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              );
            })}
          </div>
          <div className="relative md:hidden flex w-full flex-col items-center justify-center overflow-hidden   bg-background md:shadow-xl">
            <Marquee pauseOnHover className="[--duration:20s] shadow-sm  ">
              {value.map((item) => {
                const IconComponent = icons[item.icon];
                return (
                  <MagicCard
                    className=" md:size-[300px] w-[300px] md:relative   cursor-pointer flex-col    flex items-center justify-center   py-[30px] px-[30px]"
                    gradientColor={"#ffa459"}
                    gradientSize={100}
                    gradientOpacity={50}
                    gradientTransparency={50}
                  >
                    <div className="h-full w-full flex flex-col gap-10">
                      <div className="size-[50px] rounded-full bg-[#faf0e4] flex items-center justify-center">
                        <IconComponent className="text-[#fbd4a5] size-[30px] " />
                      </div>
                      <div className="flex flex-col gap-y-3">
                        <p className="text-[15px] font-bold">{item.title}</p>
                        <p className="text-[12px] font-light">
                          {" "}
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </MagicCard>
                );
              })}
            </Marquee>
          </div>
        </section>
        <section id="brand_category_suppliers_Display"></section>
        <section id="shopping_Section">
          {user && <ShoppingSection user={user} />}
        </section>
        <section id="call_to_action" className="w-full py-16 ">
          <div className="container mx-auto px-4">
            <div className="rounded-[30px] bg-[#e7822f] overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Find a marketplace for your products
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                    Become a Rokango{" "}
                    <span className="inline-flex items-center leading-0">
                      <span className=" text-4xl font-bold font-serif mr-1">
                        V
                      </span>
                      erified
                      <CheckCircle2 className="w-8 h-8 ml-2 text-white fill-green-500" />
                    </span>{" "}
                    supplier
                  </h3>
                  <p className="text-white text-lg mb-8">
                    Stand out in the market by becoming a Rokango verified
                    supplier. Showcase your commitment to quality and
                    trustworthiness, and enjoy the benefits of connecting with
                    customers who prioritize reliability.
                  </p>
                  <Button className="bg-white text-[#ffa459] hover:bg-gray-100 font-semibold py-2 px-6 rounded-full inline-flex items-center">
                    Get Verified
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="w-full md:w-1/3 bg-white  flex items-center justify-center">
                  <img
                    src="/supplier.jpg"
                    alt="Rokango Verified Supplier"
                    className="rounded-lg shadow-md w-full h-full relative"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                Why become a Rokango supplier?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Increased Visibility",
                    description:
                      "Get your products in front of more potential buyers",
                  },
                  {
                    title: "Trust and Credibility",
                    description:
                      "Earn the trust of customers with our verification badge",
                  },
                  {
                    title: "Growth Opportunities",
                    description: "Expand your business and reach new markets",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#ffa459] mx-auto mb-4" />
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
