"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/firebase";
import {
  Store,
  Truck,
  CreditCard,
  BarChart,
  Users,
  Settings,
  Box,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { label: "Dashboard", icon: BarChart, href: "/admin/dashboard" },
    { label: "Retailers", icon: Store, href: "/admin/retailers" },
    { label: "Suppliers", icon: Truck, href: "/admin/suppliers" },
    { label: "Transactions", icon: CreditCard, href: "/admin/transactions" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Inventory", icon: Box, href: "/admin/inventory" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null; // Don't render anything if user is not authenticated

  return (
    <div className="bg-white z-40 fixed lg:ml-[50px] shadow-xl lg:w-[250px] md:w-[100px] w-full lg:top-auto lg:bottom-auto top-auto bottom-5 rounded-[30px] lg:min-h-[80vh] md:h-[80vh] h-[10vh]">
      <nav className="flex lg:flex-col md:flex-col flex-row md:pt-[50px] pt-[20px] px-[30px] items-center lg:justify-center md:justify-center justify-between">
        <div className=" mb-[20px] w-full   fixed md:relative top-3 flex transition-all bg-white duration-500 ease-in-out items-center md:justify-center md:w-full gap-3 px-[10px] py-[2px] rounded-full hover:shadow-lg hover:bg-[#ffa459] cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="px-[10px] py-[3px]   text-[12px] font-medium md:flex  gap-5 rounded-full bg-[#faf0e4] text-nowrap">
            {user?.businessName}
          </div>
        </div>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`md:w-full hover:bg-[#faf0e4] text-black md:justify-start justify-center font-light flex mb-10 px-[5px] py-[5px] gap-5 rounded-full md:rounded-md
                lg:mb-4 ${
                  isActive ? "bg-[#ffa459] font-medium text-white" : ""
                }`}
            >
              <item.icon size={24} color={isActive ? "white" : "#ffa459"} />
              <span className={`${isOpen ? "block" : "hidden"} lg:block`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SideBar;
