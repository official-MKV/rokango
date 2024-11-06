"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Marquee from "@/Components/magicui/marquee";
import value from "@/data/valueProposition.json";
import { MagicCard } from "@/Components/magicui/magic-card";
import Footer from "@/Components/Footer";

import { ShoppingCart, Package, Shield } from "lucide-react";
import BrowserMockup from "@/Components/BrowserMockup";
// import HeroSection from "@/Components/Features";
import FeaturesSection from "@/Components/Features";
import CallToAction from "@/Components/CallToAction";

export default function Component() {
  const icons = {
    ShoppingCart,
    Package,
    Shield,
  };
  return (
    <div className="min-h-screen bg-[white] text-[#1C1C1C]">
      {/* Navigation */}
      <nav className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center space-x-2">
          <img className="w-32" src="/rokango.png" />
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm text-gray-300 hover:text-[#1C1C1C]">
            Home
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-[#1C1C1C]">
            Products
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-[#1C1C1C]">
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-[#ffa458] hover:bg-[#fc8e33]">Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 text-center lg:px-8">
        <div className="relative w-fit h-fit inline-block rounded bg-[#ffa458]/20 px-4 py-1.5 text-sm font-medium text-[white]">
          <span className="inset-0 text-[#ffa458]">BETA</span>
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">
          Unlock Access to Trusted Suppliers <br />
          Without the Middleman
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Rokango provides retailers direct connections to suppliers, affordable
          financing, and the tools to thrive — all in one seamless platform.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button
            variant="outline"
            className="bg-[#ffa458] text-[white]"
            size="lg"
          >
            Try it Now
          </Button>
        </div>
      </section>

      {/* MarketPlace Preview */}
      <section className="h-[60vh] relative overflow-hidden">
        <BrowserMockup />
        <div className="bg-gradient-to-b from-transparent to-white h-[100px] absolute bottom-0 left-0 right-0 z-40" />
        <div className="bg-gradient-to-b from-white to-transparent h-[100px] absolute top-0 left-0 right-0 z-40" />
      </section>

      <section
        id="value__Proposition"
        className="flex relative py-20 w-full mt-20 items-start justify-center "
      >
        <div className="md:flex hidden w-full h-fit  flex-wrap items-center justify-center  gap-[10px] md:gap-[50px] px-[10px]">
          {value.map((item) => {
            const IconComponent = icons[item.icon];
            return (
              <MagicCard
                className=" md:w-[350px] md:h-[200px] w-[300px] md:relative bg-white  border-none cursor-pointer flex-col  shadow-xl flex items-center justify-center   py-[10px] px-[30px]"
                gradientColor={"#ffa459"}
                gradientSize={100}
                gradientOpacity={50}
                gradientTransparency={50}
              >
                <div className="h-full w-full flex flex-col gap-5">
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
        <div className="relative md:hidden   flex w-full flex-col items-center justify-center overflow-hidden   bg-background md:shadow-xl">
          <Marquee pauseOnHover className="[--duration:20s] shadow-sm  ">
            {value.map((item) => {
              const IconComponent = icons[item.icon];
              return (
                <MagicCard
                  className=" md:w-[300px] h-[200px] w-[300px]  md:relative bg-white border-none shadow-xl   cursor-pointer flex-col    flex items-center justify-center   py-[10px] px-[30px]"
                  gradientColor={"#ffa459"}
                  gradientSize={100}
                  gradientOpacity={50}
                  gradientTransparency={50}
                >
                  <div className="h-full w-full flex flex-col gap-5">
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
      {/* Features */}
      <section className="min-h-screen">
        <FeaturesSection />
      </section>
      <section>
        <CallToAction />
      </section>
      <Footer />
      {/* Trusted By Section */}
    </div>
  );
}
