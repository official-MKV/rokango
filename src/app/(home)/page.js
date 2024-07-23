"use client";
import React from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import value from "@/data/valueProposition.json";
import { ShoppingCart, Package, Shield } from "lucide-react";
import ShoppingSection from "../../components/ShoppingSection";
import { useAuth } from "@/hooks/firebase";

const page = () => {
  const icons = {
    ShoppingCart,
    Package,
    Shield,
  };
  const { user, loading } = useAuth();
  return (
    <div>
      <div className=" flex flex-col  gap-[50px]">
        <section
          id="hero__Banner"
          className="w-full h-[50vh]  bg-[#faf0e4] flex px-[30px] py-[30px]"
        >
          <div className="w-1/2 h-full relative text-wrap flex flex-col gap-4">
            <div className="w-full gap-2 relative ">
              <p className="text-5xl font-bold leading-tight ">
                Connect Directly with Manufacturers & Local Suppliers
              </p>
              <p className="w-[80%] text-[15px] font-light">
                Streamline your supply chain and discover quality products at
                competitive prices.
              </p>
            </div>

            <div className="flex">
              <div className="font-medium mt-[10px] px-[20px] py-[10px] bg-[#ffa459] text-[white] cursor-pointer hover:bg-[#ff8f33] hover:rounded-[10px] transition-all duration-500 ease-in-out">
                Shop Now
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full relative"></div>
        </section>
        <section id="value__Proposition">
          <div className="relative w-full flex items-center justify-center gap-[50px]">
            {value.map((item) => {
              const IconComponent = icons[item.icon];
              return (
                <MagicCard
                  className=" w-[300px] h-[300px] cursor-pointer flex-col  shadow-2xl flex items-center justify-center   py-[30px] px-[30px]"
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
