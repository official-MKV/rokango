"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

const benefits = [
  {
    title: "Increased Visibility",
    description: "Get your products in front of more potential buyers",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
  {
    title: "Quick Payout",
    description: "Get paid quickly after completing delivery",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
  {
    title: "Growth Opportunities",
    description: "Expand your business and reach new markets",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function CallToAction() {
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % benefits.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-24 bg-gradient-to-b from-orange-50/10 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative rounded-[40px]  bg-gradient-to-b from-[#ffa458] to-[#ff8a2b] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

          <div className="flex flex-col lg:flex-row items-center relative">
            <div className="w-full lg:w-2/3 p-8 lg:p-16">
              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Your marketplace for your products
                </h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl lg:text-3xl font-semibold text-white">
                    Become a Rokango Supplier
                  </span>
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/90 text-lg mb-8 max-w-2xl">
                  Stand out in the market by becoming a Rokango verified
                  supplier. Showcase your commitment to quality and
                  trustworthiness, and enjoy the benefits of connecting with
                  customers who prioritize reliability.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="/register/supplier">
                    <Button
                      onClick={() => {
                        const { protocol, host } = window.location;
                        const baseUrl =
                          process.env.NODE_ENV === "production"
                            ? host
                            : `${host}`;
                        window.location.href = `http://app.${baseUrl}/register`;
                      }}
                      className="bg-white text-[#ff8a2b] hover:bg-gray-50 font-semibold py-6 px-8 rounded-full text-lg group"
                    >
                      Register Now
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/3 p-8 lg:p-0">
              <motion.div
                className="relative h-64 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/supplier.jpg"
                  alt="Rokango Verified Supplier"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-12 text-gray-900">
            Why become a Rokango supplier?
          </h3>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="relative group"
                variants={fadeIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffa459]/10 to-transparent rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="size-[60px] rounded-full bg-orange-100 flex items-center justify-center mb-6">
                    <div className="text-[#ffa459]">{benefit.icon}</div>
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ x: `-${currentCard * 100}%` }}
            >
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="w-full flex-shrink-0 px-4">
                  <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg">
                    <div className="size-[60px] rounded-full bg-orange-100 flex items-center justify-center mb-6">
                      <div className="text-[#ffa459]">{benefit.icon}</div>
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-gray-900">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentCard === index ? "bg-[#ffa459]" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentCard(index)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
