import React from "react";
import { Clock } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Clock size={120} className="text-gray-400 mb-8" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-700 mb-4 text-center">
        Coming Soon
      </h1>
      <p className="text-xl md:text-2xl text-gray-500 text-center">
        We're working hard to bring you something amazing!
      </p>
    </div>
  );
};

export default ComingSoon;
