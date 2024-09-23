import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-[#ffa458] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
        What are you?
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-3xl">
        <UserTypeBox href="/register/retailer" type="Retailer" />
        <UserTypeBox href="/register/supplier" type="Supplier" />
      </div>
    </div>
  );
};

const UserTypeBox = ({ href, type }) => (
  <a href={href} className="w-full md:w-auto">
    <div
      className="text-[#ffa458] bg-white min-w-[200px] px-[10px] py-2
                    hover:text-white hover:bg-[#ffa458] hover:scale-[1.02]
                    cursor-pointer transition-all duration-700 ease-in-out
                    text-center font-bold text-2xl md:text-4xl lg:text-5xl
                    border-2 border-white"
    >
      {type}
    </div>
  </a>
);

export default Page;
