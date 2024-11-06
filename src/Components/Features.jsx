"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const features = [
  {
    id: "discover",
    title: "Discover Suppliers",
    description: "Connect with verified suppliers in your area",
    image: "/screens/screen-6.jpeg",
  },
  {
    id: "eat",
    title: "eat Suppliers",
    description: "Connect with verified suppliers in your area",
    image: "/screens/screen-4.jpeg",
  },

  {
    id: "buy",
    title: "Buy from Suppliers",
    description: "Order directly with real-time inventory updates",
    image: "/screens/screen-5.jpeg",
  },
  {
    id: "credit",
    title: "Access Credit",
    description: "Get instant credit approval at checkout",
    image: "/screens/screen-3.jpeg",
  },
  {
    id: null,
    title: null,
    description: null,
    image: "/screen-3.png",
  },
  {
    id: null,
    title: null,
    description: null,
    image: "/screen-3.png",
  },
];

export default function FeaturesSection() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = React.useRef(null);

  // Setup scroll monitoring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Map scroll progress to feature index
  const currentFeatureIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, features.length - 1]
  );

  // Update active section based on scroll
  useMotionValueEvent(currentFeatureIndex, "change", (latest) => {
    setActiveSection(Math.round(latest));
  });

  const handleFeatureClick = (index) => {
    const container = containerRef.current;
    if (!container) return;
    console.log(index);
    const containerHeight = container.getBoundingClientRect().height;
    const scrollAmount = (containerHeight / features.length + 1) * index;
    console.log(`scroll amount:${scrollAmount}`);

    window.scrollTo({
      top: container.offsetTop + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <motion.div ref={containerRef} className="relative min-h-[300vh]">
      <motion.div
        className="sticky top-0 min-h-screen flex items-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8 ">
          <div className="flex flex-col lg:grid lg:grid-cols-2 md:gap-8 items-center">
            {/* Left side - Content */}
            <div className="w-full order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative w-fit h-fit inline-block rounded bg-[#ffa458]/20 px-4 py-1.5 text-sm font-medium text-[white]">
                  <span className="inset-0 text-[#ffa458]">FOR RETAILERS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 md:mb-6">
                  Discover and Connect with Verified Suppliers
                </h1>
                <p className="text-gray-600 md:mb-8 mb-4 text-sm">
                  Access a network of trusted suppliers, manage orders, and get
                  instant credit all in one platform.
                </p>
              </motion.div>

              {/* Feature Indicators */}
              <div className="relative  flex flex-row lg:flex-col mb-4 items-start gap-8 lg:gap-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    className="flex flex-col lg:flex-row items-center mb-4 lg:items-baseline gap-2 cursor-pointer"
                    onClick={() => handleFeatureClick(index)}
                    animate={{
                      opacity: activeSection === index ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.id && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#ffa458]"
                        animate={{
                          scale: activeSection === index ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="flex-grow text-center lg:text-left md:text-[16px] text-[12px]">
                      <h3
                        className={`font-medium ${
                          activeSection === index
                            ? "text-[#ffa458]"
                            : "text-gray-600"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <motion.p
                        className="text-[10px] max-w-[200px] lg:ml-0  lg:block hidden"
                        transition={{ duration: 0.3 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button className="bg-[#ffa458] text-white hidden md:flex hover:bg-[#ff9544] w-fit lg:w-auto">
                Contact us
              </Button>
            </div>

            {/* Right side - Phone Mockup */}
            <div className="relative h-[400px] md:scale-100 scale-75 lg:h-[600px] flex items-center justify-center order-2 lg:order-2">
              <div className="relative w-[240px] lg:w-[300px] h-[480px] lg:h-[600px]">
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-xl overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-black">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full" />
                  </div>

                  {/* Screen Content */}
                  <div className="absolute top-6 inset-x-0 bottom-0 bg-white overflow-hidden px-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        className="absolute inset-0  "
                        animate={{
                          opacity: activeSection === index ? 1 : 0,
                          y: activeSection === index ? "0%" : "100%",
                        }}
                        transition={{ duration: 0.7 }}
                      >
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
