import React from "react";
import NavBar from "@/components/NavBar";

const layout = ({ children }) => {
  return (
    <div className="w-full h-full relative">
      <div className="relative w-full px-[100px] pt-[50px]">
        <NavBar />
      </div>
      <div id="body" className="px-[100px] py-[30px]">
        {children}
      </div>
    </div>
  );
};

export default layout;
