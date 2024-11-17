import React from "react";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-hidden md:px-[100px] pt-[10px]">
      <NavBar />

      <div
        id="body"
        className=" pb-[60px]  w-full max-w-full overflow-x-hidden "
      >
        {children}
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
