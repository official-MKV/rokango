"use client";

import * as React from "react";
import { Button } from "@/Components/ui/button";
import ValuePropositionSection from "@/Components/ValueProposition";
import BrowserMockup from "@/Components/BrowserMockup";
import FeaturesSection from "@/Components/Features";
import CallToAction from "@/Components/CallToAction";
import { split } from "lodash";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      {/* Hero Section - Enhanced with better typography and spacing */}
      <section className="px-6 py-24 lg:py-32 text-center lg:px-8 max-w-7xl mx-auto">
        <div className="relative inline-block mb-6">
          <div className="flex items-center justify-center gap-3 rounded-full bg-orange-100/50 px-6 py-2 border border-orange-200">
            <div className="w-2.5 h-2.5 bg-[#ffa458] rounded-full animate-pulse" />
            <span className="text-[#ffa458] font-semibold">
              BETA: Abuja, Jos
            </span>
            <img src="/ng.png" className="w-8" alt="Nigeria flag" />
          </div>
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
          Unlock New Profit Margins
          <br className="hidden sm:block" /> and Growth Potential for Your
          Retail Business
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600 leading-relaxed">
          Rising costs, cash flow crunches, and limited access to manufacturers
          hold retailers back. Our platform connects you directly with FMCG
          producers, offering exclusive trade credit and group buying power so
          you can buy smarter, save more, and fuel your business growth.
        </p>
        <div className="mt-12 flex justify-center gap-4">
          <Button
            className="bg-[#ffa458] hover:bg-[#fc8e33] text-white px-8 py-6 text-lg shadow-xl shadow-orange-200/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            size="lg"
            onClick={() => {
              const { protocol, host } = window.location;

              const cleanedHost = host.startsWith("www.")
                ? host.slice(4)
                : host;

              const baseUrl = `app.${cleanedHost}`;

              window.location.href = `${protocol}//${baseUrl}/register`;
            }}
          >
            Try it Now
          </Button>
        </div>
      </section>

      <section className="h-full relative overflow-hidden my-12">
        <BrowserMockup />
        <div className="bg-gradient-to-b from-transparent to-orange-50/30 h-[150px] absolute bottom-0 left-0 right-0 z-40" />
        <div className="bg-gradient-to-b from-white to-transparent h-[150px] absolute top-0 left-0 right-0 z-40" />
      </section>
      <section id="value__Proposition" className="py-24 w-full">
        <ValuePropositionSection />
      </section>

      <section className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
        <FeaturesSection />
      </section>

      <section>
        <CallToAction />
      </section>
    </div>
  );
}
