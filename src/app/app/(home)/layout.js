import React from "react";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="relative w-full pt-[50px] md:px-[100px] ">
        <NavBar />
      </div>
      <div
        id="body"
        className="py-[30px] w-full max-w-full overflow-x-hidden md:px-[100px]"
      >
        {children}
      </div>
      <div className="md:px-[100px]">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
