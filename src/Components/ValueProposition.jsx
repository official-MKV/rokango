"use client";

import value from "@/data/valueProposition.json";
import { MagicCard } from "@/Components/magicui/magic-card";
import { ShoppingCart, Package, Shield } from "lucide-react";

const ValuePropositionSection = () => {
  const icons = {
    ShoppingCart,
    Package,
    Shield,
  };

  return (
    <section className="py-24 w-full bg-gradient-to-b from-orange-50/10 to-white">
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-8 px-6">
        {value.map((item) => {
          const IconComponent = icons[item.icon];
          return (
            <MagicCard
              key={item.title}
              className="h-[220px] bg-white/80 backdrop-blur-sm border-none cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
              gradientColor="#ffa458"
              gradientSize={150}
              gradientOpacity={40}
              gradientTransparency={60}
            >
              <div className="h-full w-full flex flex-col gap-6 p-8">
                <div className="size-[60px] rounded-full bg-orange-100 flex items-center justify-center">
                  <IconComponent className="text-[#ffa458] size-[32px]" />
                </div>
                <div className="flex flex-col gap-y-3">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </MagicCard>
          );
        })}
      </div>

      {/* Mobile Stack */}
      <div className="md:hidden px-4 flex flex-col gap-6 max-w-lg mx-auto">
        {value.map((item) => {
          const IconComponent = icons[item.icon];
          return (
            <MagicCard
              key={item.title}
              className="h-[220px] bg-white/80 backdrop-blur-sm border-none shadow-xl"
              gradientColor="#ffa458"
              gradientSize={150}
              gradientOpacity={40}
              gradientTransparency={60}
            >
              <div className="h-full w-full flex flex-col gap-6 p-8">
                <div className="size-[60px] rounded-full bg-orange-100 flex items-center justify-center">
                  <IconComponent className="text-[#ffa458] size-[32px]" />
                </div>
                <div className="flex flex-col gap-y-3">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </MagicCard>
          );
        })}
      </div>
    </section>
  );
};

export default ValuePropositionSection;
