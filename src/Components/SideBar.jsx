import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/firebase";
import {
  Settings,
  Package,
  Users,
  CreditCard,
  BarChart,
  ShoppingCart,
  AreaChart,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this import based on your Firebase setup

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
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "retailer") {
      setMenuItems(RetailerMenuItems);
    } else if (user?.role === "supplier" || user?.role === "admin") {
      setMenuItems(SupplierMenuItems);
    } else {
      setMenuItems([]);
    }
    console.log(user?.uid);
    console.log(user);
    if (user?.uid) {
      console.log(user.uid);
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
        <div className="relative cursor-pointer">
          <Bell size={24} color="#ffa459" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-[2px] py-[1px] text-[8px] bg-red-500 text-white rounded-full">
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
    <div className="bg-white z-40 fixed lg:ml-[50px] shadow-xl lg:w-[250px] md:w-[100px] w-[100vw] lg:top-auto lg:bottom-auto top-auto bottom-5 rounded-[30px] lg:min-h-[80vh] md:h-[80vh] h-[10vh] ">
      <nav className="flex lg:flex-col md:flex-col flex-row md:pt-[50px] pt-[20px] px-[30px] items-center lg:justify-center md:justify-center justify-between">
        <div className="mb-[20px] w-full fixed md:relative top-3 flex transition-all bg-white duration-500 ease-in-out items-center md:justify-center md:w-full gap-3 px-[10px] py-[2px] rounded-full hover:shadow-lg hover:bg-[#ffa459] cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="px-[10px] py-[3px] text-[12px] font-medium md:flex gap-5 rounded-full bg-[#faf0e4] text-nowrap">
            {user?.businessName}
          </div>
        </div>

        <div className="fixed left-[60vw] md:top-0 md:left-0 md:relative top-4  md:flex lg:flex md:w-full hover:bg-[#faf0e4] text-black md:justify-start justify-center font-light mb-10 px-[5px] py-[5px] gap-5 rounded-full md:rounded-md lg:mb-4">
          <NotificationDialog />
          <span className={`${isOpen ? "block" : "hidden"} lg:block`}>
            Notifications
          </span>
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
