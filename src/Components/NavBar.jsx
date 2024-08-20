"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import navItems from "@/data/navItems.json";
import { useAuth } from "@/hooks/firebase";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { useCart } from "@/hooks/firebase";
import {
  PackageSearch,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut as firebaseSignOut } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

export function NavBar() {
  const router = useRouter();
  const allNavItems = [...navItems.common];
  const { user, loading } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    cart,
    cartId,
    isLoading,
    isError,
    addToCart,
    updateQuantity,
    removeItem,
  } = useCart(user?.uid);

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAddToCartPopup(true);
  };

  const handleUpdateQuantity = (productId, change) => {
    updateQuantity(productId, change);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckingOut(true);
    if (!user.email || !totalPrice) {
      console.error("Missing required checkout information");
      return { error: "Missing required checkout information" };
    }

    try {
      const transactionRef = await addDoc(collection(db, "transactions"), {
        status: "pending",
        cart_id: cartId,
        user_email: user.email,
        amount: totalPrice,
        created_at: new Date(),
      });
      const response = await fetch(`/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: totalPrice,
          reference: transactionRef.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.error}`
        );
      }

      const data = await response.json();

      if (!data.data || !data.data.authorization_url) {
        throw new Error("Authorization URL not received from server");
      }

      localStorage.setItem("paymentReference", transactionRef.id);
      setCheckingOut(false);
      window.location.href = data.data.authorization_url;
    } catch (error) {
      console.error("There was a problem with the checkout process:", error);
      return { error: error.message };
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white fixed z-50 top-0 w-full">
      <div className="md:w-[85vw] w-full py-[10px] md:px-[20px] px-[5px] flex justify-between items-center">
        <div
          className="relative md:h-16 h-10 cursor-pointer"
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

        <div className="hidden md:flex items-center gap-x-4">
          {allNavItems.map((item, key) => (
            <NavLink key={key} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-5 ">
          {!loading && user ? (
            <>
              <div
                onClick={() => setShowOrderPopup(true)}
                className="relative p-[10px] rounded-full group transition-all duration-500 ease-in-out hover:shadow-lg flex items-center justify-center hover:text-[white] cursor-pointer hover:bg-[#ffa459]"
              >
                <ShoppingCart className="text-gray-400 group-hover:text-[white] w-8 h-8" />
                <span className="top-0 group-hover:bg-[white] group-hover:text-[#ffa459] right-0 absolute text-white bg-[#ffa459] size-[16px] text-[12px] rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              </div>
              <div
                onClick={() => {
                  const route =
                    user.role === "admin"
                      ? "/admin"
                      : user.role === "supplier"
                      ? "/dashboard"
                      : "/profile";
                  router.push(route);
                  setMobileMenuOpen(false);
                }}
                className="hidden md:flex items-center cursor-pointer py-[2px] pl-[2px] gap-3 hover:bg-[#ffa459] rounded-full pr-[2px]"
              >
                <Avatar className=" ">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="px-[10px] py-[3px] text-[12px] font-medium gap-5 rounded-full bg-[#faf0e4] text-nowrap">
                  {user.businessName}
                </div>
              </div>
              <div
                className="px-4 py-2 font-normal hidden md:block text-[15px] hover:bg-[#ffa459] text-black hover:rounded-[5px] transition-all duration-500 ease-in-out hover:text-white  cursor-pointer"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out
              </div>
            </>
          ) : !loading ? (
            <div
              onClick={() => router.push("/login")}
              className="w-[100px] py-[10px] cursor-pointer hover:bg-[#ff9844] bg-[#ffa459] text-center flex items-center justify-center"
            >
              <span className="text-[white] font-medium">Login</span>
            </div>
          ) : null}

          <button onClick={toggleMobileMenu} className="md:hidden">
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-500" />
            ) : (
              <Menu className="h-6 w-6 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {allNavItems.map((item, key) => (
            <Link
              key={key}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!loading && user && (
            <>
              <div
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const route =
                    user.role === "admin"
                      ? "/admin"
                      : user.role === "supplier"
                      ? "/dashboard"
                      : "/profile";
                  router.push(route);
                  setMobileMenuOpen(false);
                }}
              >
                Profile
              </div>
              <div
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out
              </div>
            </>
          )}
        </div>
      )}

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
              onClick={() => {
                handleCheckout();
                setShowOrderPopup(false);
              }}
            >
              CheckOut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
