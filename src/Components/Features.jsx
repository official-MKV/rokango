"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/Components/ui/button";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const features = [
  {
    id: "buy-direct",
    title: "Buy Directly from Manufacturers",
    description:
      "Get transparent pricing and access to high-quality products straight from top FMCG manufacturers.",
    image: "/screens/screen-11.jpeg",
  },
  {
    id: "group-buying",
    title: "Group Buying for Better Prices",
    description:
      "Team up with other retailers to access bulk pricing and maximize your cost savings.",
    image: "/screens/screen-12.jpeg",
  },
  {
    id: "credit",
    title: "Buy Now, Pay Later",
    description:
      "Secure the stock you need with instant credit approval—pay only after making your sales.",
    image: "/screens/screen-13.jpeg",
  },

  // Null features for spacing
  {
    id: "null-1",
    title: "",
    description: "",
    image: "",
  },
  {
    id: "null-2",
    title: "",
    description: "",
    image: "",
  },
];

export default function FeaturesSection() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const currentFeatureIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, features.length - 1]
  );

  useMotionValueEvent(currentFeatureIndex, "change", (latest) => {
    setActiveSection(Math.round(latest));
  });

  const handleFeatureClick = (index) => {
    const container = containerRef.current;
    if (!container) return;
    const containerHeight = container.getBoundingClientRect().height;
    const scrollAmount = (containerHeight / features.length) * index;
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
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 md:gap-8 items-center">
            {/* Left side - Content */}
            <div className="w-full order-1 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative w-fit h-fit inline-block rounded bg-[#ffa458]/20 px-4 py-1.5 text-sm font-medium">
                  <span className="text-[#ffa458]">FOR RETAILERS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
                  Discover and Connect with Verified Suppliers
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Access a network of trusted suppliers, manage orders, and get
                  instant credit all in one platform.
                </p>
              </motion.div>

              <div className="relative flex flex-col mb-8 items-start gap-6">
                {features.map((feature, index) =>
                  feature.title && feature.description ? ( // Conditionally render only non-null features
                    <motion.div
                      key={feature.id}
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => handleFeatureClick(index)}
                      animate={{
                        opacity: activeSection === index ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[#ffa458]"
                        animate={{
                          scale: activeSection === index ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <div>
                        <h3
                          className={`font-medium text-lg ${
                            activeSection === index
                              ? "text-[#ffa458]"
                              : "text-gray-600"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <motion.p
                          className="text-sm text-gray-500 max-w-xs"
                          transition={{ duration: 0.3 }}
                        >
                          {feature.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : null
                )}
              </div>

              <Button className="bg-[#ffa458] text-white hover:bg-[#ff9544] w-full sm:w-auto">
                Contact us
              </Button>
            </div>

            {/* Right side - iPhone 12-like Mockup */}
            <div className="relative h-[600px] flex items-center justify-center order-2 lg:order-2 mt-12 lg:mt-0">
              <div className="relative w-[300px] h-[600px]">
                <div className="absolute inset-0 bg-black rounded-[50px] shadow-xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-3xl" />

                  {/* Screen Content */}
                  <div className="absolute top-1 inset-x-1 bottom-1 bg-white rounded-[46px] overflow-hidden">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        className="absolute inset-2 rounded-[42px] overflow-hidden"
                        animate={{
                          opacity: activeSection === index ? 1 : 0,
                          scale: activeSection === index ? 1 : 0.9,
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
