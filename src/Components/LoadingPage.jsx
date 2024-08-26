import React from "react";
import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="w-screen h-screen absolute inset-0 z-50 flex flex-col items-center justify-center bg-[white]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          className="w-32 h-32"
          src="/rokango.png"
          alt="Rokango Logo"
          style={{ objectFit: "contain" }}
        />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        className="h-1 bg-[#ffa459] mt-8 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-[#ffa459] mt-4 text-lg font-semibold"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
