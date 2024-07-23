"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import navItems from "@/data/navItems.json";
import { useAuth } from "@/hooks/firebase";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/firebase";
import { PackageSearch, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NavBar() {
  const router = useRouter();

  const roleSpecificItems = navItems["admin"];
  const allNavItems = [...navItems.common, ...roleSpecificItems];
  const { user, loading } = useAuth();
  const { cart } = useCart(user?.uid);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <nav className="bg-white ">
      <AlertDialog open={showOrderPopup} onOpenChange={setShowOrderPopup}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Your Order</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mt-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">₦{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="font-semibold">Total: ₦{totalPrice.toFixed(2)}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-transparent border-[2px] border-[black] text-[black] hover:bg-[black] hover:text-[white]"
              onClick={() => setShowOrderPopup(false)}
            >
              Close
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-[#ffa459] hover:bg-[#ff7c11]"
              onClick={() => setShowOrderPopup(false)}
            >
              CheckOut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full  py-[10px] px-[20px] flex">
        <div
          className="relative h-16 cursor-pointer"
          id="logo"
          onClick={() => {
            router.push("/");
          }}
        >
          <img
            src="/rokango.png"
            style={{ objectFit: "contain" }}
            className="w-full h-full cursor-pointer"
          />
        </div>
        <div className="w-full px-[20px] gap-x-4 flex items-center">
          {allNavItems.map((item, key) => {
            return <NavLink item={item} />;
          })}
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-5">
              <div
                onClick={() => {
                  setShowOrderPopup(true);
                }}
                className=" relative p-[10px] rounded-full group transition-all duration-500 ease-in-out hover:shadow-lg flex items-center justify-center  hover:text-[white] cursor-pointer hover:bg-[#ffa459]"
              >
                <ShoppingCart className="text-gray-400  group-hover:text-[white] w-8 h-8" />
                <span className="top-0 group-hover:bg-[white] group-hover:text-[#ffa459] right-0 absolute text-white bg-[#ffa459] size-[16px] text-[12px] rounded-full flex items-center justify-center ">
                  {cart.length}
                </span>
              </div>
              <div
                onClick={() => {
                  router.push("/profile");
                }}
                className="flex transition-all duration-500 ease-in-out items-center w-full gap-3 px-[10px] py-[2px] rounded-full hover:shadow-lg hover:bg-[#ffa459] cursor-pointer"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="px-[10px] py-[3px]  text-[12px] font-medium flex gap-5 rounded-full bg-[#faf0e4] text-nowrap">
                  {user.retailerName}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className="w-[100px] py-[10px] cursor-pointer hover:bg-[#ff9844] bg-[#ffa459] text-center flex items-center justify-center"
            >
              <span className="text-[white] font-medium">Login</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#007bff" : "#333",
    fontWeight: isActive(path) ? "bold" : "normal",
  });

  if (item.dropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="nav-link" style={linkStyle(item.href)}>
          {item.label}
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            {item.dropdown.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href} className="nav-link" style={linkStyle(item.href)}>
      {item.label}
    </Link>
  );
}
export default NavBar;
