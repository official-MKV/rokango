import React from "react";
import NavBar from "@/components/NavBar";

const layout = ({ children }) => {
  return (
    <div className="w-full h-full relative">
      <div className="relative w-full md:px-[100px] pt-[50px]">
        <NavBar />
      </div>
      <div id="body" className="md:px-[100px] py-[30px]">
        {children}
      </div>
    </div>
  );
};

export default layout;
