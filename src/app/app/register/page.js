"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Page = () => {
  return (
    <div className="  h-screen w-full bg-gradient-to-b from-[#ffa458] to-[#ff8a2b] flex flex-col items-center justify-center ">
      <motion.div
        className="absolute top-8 md:top-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/logo-white.svg"
          alt="Rokango Logo"
          width={180}
          height={48}
          className="w-32 md:w-44 lg:w-52"
          priority
        />
      </motion.div>

      <motion.div
        className="flex flex-col items-center max-w-4xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
          What are you?
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-3xl">
          <UserTypeBox href="/register/retailer" type="Retailer" />
          <UserTypeBox href="/register/supplier" type="Supplier" />
        </div>
        <motion.p
          className="mt-8 text-white/80 text-center text-sm md:text-base"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          Choose your account type to get started with Rokango
        </motion.p>
      </motion.div>
    </div>
  );
};

const UserTypeBox = ({ href, type }) => (
  <motion.a
    href={href}
    className="w-full md:w-auto"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div
      className="relative overflow-hidden text-[#ffa458] bg-white/95 backdrop-blur-sm
                 min-w-[200px] px-8 py-4 rounded-xl
                 hover:text-white hover:bg-[#ffa458]
                 cursor-pointer transition-all duration-300 ease-in-out
                 text-center font-bold text-2xl md:text-4xl lg:text-5xl
                 border-2 border-white/20 shadow-lg
                 group"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0
                    transform translate-x-[-100%] group-hover:translate-x-[100%]
                    transition-transform duration-1000"
      />
      {type}
    </div>
  </motion.a>
);

export default Page;
