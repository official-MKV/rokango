"use client";
import React from "react";
import { MagicCard } from "@/Components/magicui/magic-card";
import value from "@/data/valueProposition.json";
import { ShoppingCart, Package, Shield } from "lucide-react";
import ShoppingSection from "../../Components/ShoppingSection";
import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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

    verifyPayment();
  }, [router.query]);

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
              <div className="font-medium mt-[10px] px-[20px] py-[10px] bg-[#ffa459] text-[white] cursor-pointer hover:bg-[#ff8f33] hover:rounded-[10px] transition-all duration-500 ease-in-out">
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
          <div className="relative w-full flex  flex-wrap items-center justify-center  gap-[10px] md:gap-[50px]">
            {value.map((item) => {
              const IconComponent = icons[item.icon];
              return (
                <MagicCard
                  className=" md:size-[300px] size-[250px] cursor-pointer flex-col  shadow-2xl flex items-center justify-center   py-[30px] px-[30px]"
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
        </section>
        <section id="brand_category_suppliers_Display"></section>
        <section id="shopping_Section">
          {user && <ShoppingSection user={user} />}
        </section>
      </div>
    </div>
  );
};

export default page;
