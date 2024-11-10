"use client";
import React, { useState } from "react";
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
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
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
  const [openDropdowns, setOpenDropdowns] = useState({});

  const { cart, cartId, addToCart, updateQuantity, removeItem } = useCart(
    user?.uid
  );

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user?.email || !totalPrice) return;
    setCheckingOut(true);

    try {
      const transactionRef = await addDoc(collection(db, "transactions"), {
        status: "pending",
        cart_id: cartId,
        user_email: user.email,
        amount: totalPrice,
        created_at: new Date(),
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          amount: totalPrice,
          reference: transactionRef.id,
        }),
      });

      const data = await response.json();
      if (data.data?.authorization_url) {
        localStorage.setItem("paymentReference", transactionRef.id);
        window.location.href = data.data.authorization_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckingOut(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="bg-white md:w-[85 fixed w-full top-0 inset-0 h-fit z-50 shadow-sm">
      <div className=" mx-auto px-6  sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img src="/rokango.png" alt="Logo" className="h-8 w-auto sm:h-10" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavItems.map((item, index) => (
              <NavLink key={index} item={item} />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <>
                {/* Cart Button */}
                <button
                  onClick={() => setShowOrderPopup(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* User Profile */}
                <div className="relative group">
                  <button className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture} />
                      <AvatarFallback>
                        {user?.businessName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">
                      {user.businessName}
                    </span>
                  </button>

                  <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={() => {
                        const route =
                          user.role === "admin"
                            ? "/admin"
                            : user.role === "supplier"
                            ? "/dashboard"
                            : "/profile";
                        router.push(route);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : !loading ? (
              <Button
                onClick={() => router.push("/login")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Login
              </Button>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {allNavItems.map((item, index) => (
              <div key={index} className="py-1">
                <button
                  onClick={() => {
                    if (item.href) router.push(item.href);
                    if (item.subLinks) toggleDropdown(index);
                  }}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                  {item.subLinks &&
                    (openDropdowns[index] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    ))}
                </button>

                {item.subLinks && openDropdowns[index] && (
                  <div className="pl-4 space-y-1">
                    {item.subLinks.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => {
                          router.push(subItem.href);
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-100"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Dialog */}
      <AlertDialog open={showOrderPopup} onOpenChange={setShowOrderPopup}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Your Cart</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Your cart is empty
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold">
              Total: ₦{totalPrice.toLocaleString()}
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowOrderPopup(false)}
              >
                Continue Shopping
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut || cart.length === 0}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}

function NavLink({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (item.subLinks) {
    return (
      <div
        className="relative group"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
          {item.label}
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
            {item.subLinks.map((subItem, index) => (
              <button
                key={index}
                onClick={() => router.push(subItem.href)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {subItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push(item.href)}
      className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium"
    >
      {item.label}
    </button>
  );
}

export default NavBar;
