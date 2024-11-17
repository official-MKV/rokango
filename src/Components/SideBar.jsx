"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/firebase";
import { getAuth, signOut } from "firebase/auth";
import {
  Settings,
  Package,
  Users,
  CreditCard,
  BarChart,
  ShoppingCart,
  AreaChart,
  Bell,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { onSnapshot, query, collection, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

const SupplierMenuItems = [
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },
  { label: "Transactions", icon: CreditCard, href: "/dashboard/transactions" },
  { label: "Analytics", icon: BarChart, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const RetailerMenuItems = [
  { label: "Personal Settings", icon: Settings, href: "/profile/settings" },
  { label: "Orders", icon: ShoppingCart, href: "/profile/orders" },
  { label: "Payment", icon: CreditCard, href: "/profile/payment" },
  { label: "Analytics", icon: AreaChart, href: "/profile/analytics" },
];

const SideBar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const auth = getAuth(); // Get the Firebase Auth instance

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error signing out:", error); // Handle any errors
    }
  };

  useEffect(() => {
    if (user?.role === "retailer") {
      setMenuItems(RetailerMenuItems);
    } else if (user?.role === "supplier" || user?.role === "admin") {
      setMenuItems(SupplierMenuItems);
    } else {
      setMenuItems([]);
    }

    if (user?.uid) {
      const q = query(
        collection(db, "notifications"),
        where("recipient", "==", user.uid),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (!user) return null;

  const NotificationDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer flex items-center gap-2 hover:bg-[#faf0e4] w-full py-2 px-3 rounded-md">
          <Bell size={20} color="#ffa459" />
          <span className="hidden lg:block">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="absolute top-0 right-0 px-1 py-px text-[8px] bg-red-500 text-white rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            Notifications
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <div className="grid gap-4 p-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at.toDate()).toLocaleString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500">No new notifications</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="fixed z-50 bg-white  lg:left-0 lg:top-0 lg:bottom-auto bottom-4 rounded-full md:rounded px-1 shadow-xl lg:w-64 w-full lg:h-full h-16 items-center justify-center">
      <nav className="flex lg:flex-col flex-row lg:h-full h-full items-center lg:items-start lg:pt-8 px-4">
        <div className="lg:mb-8 lg:w-full flex items-center justify-center lg:justify-start gap-3 py-2 px-3 rounded-full hover:bg-[#faf0e4] cursor-pointer md:relative fixed top-0 ">
          <Avatar>
            <AvatarImage src={user?.picture} alt={user?.businessName} />
            <AvatarFallback>{user?.businessName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block px-2 py-1 text-sm font-medium rounded-full bg-[#faf0e4] text-nowrap whitespace-nowrap overflow-clip text-ellipsis">
            {user?.businessName}
          </div>
        </div>

        <div className="lg:mb-4 lg:w-full md:relative fixed top-2 md:right-0 right-2">
          <NotificationDialog />
        </div>

        <div className="flex lg:flex-col flex-row lg:space-y-2 space-x-4 lg:space-x-0 lg:w-full overflow-x-auto lg:overflow-x-visible bg-white z-50 justify-center items-center w-full">
          {menuItems.map((item, index) => {
            const isActive = pathname.split("/")[2] === item.href.split("/")[2];

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center lg:w-full hover:bg-[#faf0e4] text-black font-light py-3 px-3 md:rounded-md rounded-full
                  ${isActive ? "bg-[#ffa459] font-medium text-white" : ""}`}
              >
                <item.icon size={20} color={isActive ? "white" : "#ffa459"} />
                <span className="hidden lg:block ml-3">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div
          id="other_functions"
          className="lg:absolute lg:bottom-8 lg:left-0 lg:right-0 lg:px-4 fixed bottom-20 left-1/2 -translate-x-1/2 lg:translate-x-0 flex flex-col gap-3 w-full max-w-[250px] lg:max-w-none"
        >
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 text-white bg-[#ffa458] rounded-md hover:scale-105 transition-all duration-500 cursor-pointer hover:bg-[#f19950] text-center"
          >
            Go back shopping page
          </button>

          <button
            onClick={() => {
              handleLogout();
            }}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-3 border-2 border-[#ffa458] rounded-md text-[#ffa458] hover:bg-gray-100 hover:scale-105 transition-all duration-500"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
