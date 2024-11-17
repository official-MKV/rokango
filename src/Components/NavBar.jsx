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
import CheckoutModal from "@/Components/CheckoutModal";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Menu,
  X,
  ChevronDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/Components/ui/sheet";

export function NavBar() {
  const router = useRouter();
  const allNavItems = [...navItems.common];
  const { user, loading } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const { cart, cartId, addToCart, updateQuantity, removeItem } = useCart(
    user?.uid
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayStakc = async () => {
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

  const handleCheckout = async () => {
    if (!user?.email || !totalPrice) return;
    setCheckingOut(true);
    setIsModalOpen(true);
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
    <nav className="sticky max-h-[80px]  top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-orange-100 ">
      <div className="flex  items-center justify-between  ">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/rokango.png"
            alt="Logo"
            className="w-36 hover:opacity-90 transition-opacity"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {allNavItems.map((item, index) =>
            item.subLinks ? (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors">
                  <span className="flex items-center gap-1">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.subLinks.map((subItem, subIndex) => (
                    <DropdownMenuItem
                      key={subIndex}
                      onClick={() => router.push(subItem.href)}
                      className="cursor-pointer"
                    >
                      {subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                key={index}
                onClick={() => router.push(item.href)}
                className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors"
              >
                {item.label}
              </button>
            )
          )}
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
                  <span className="absolute -top-1 -right-1 bg-[#ffa458] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback>
                      {user?.businessName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user.businessName}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      const route =
                        user.role === "admin"
                          ? "/admin"
                          : user.role === "supplier"
                          ? "/dashboard"
                          : "/profile";
                      router.push(route);
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : !loading ? (
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#ffa458] hover:bg-[#fc8e33] shadow-lg shadow-orange-200/50 transition-all duration-300"
            >
              Login
            </Button>
          ) : null}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2 md:hidden" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-8">
                {allNavItems.map((item, index) => (
                  <div key={index}>
                    {item.subLinks ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors w-full text-left">
                          {item.label}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {item.subLinks.map((subItem, subIndex) => (
                            <DropdownMenuItem
                              key={subIndex}
                              onClick={() => router.push(subItem.href)}
                            >
                              {subItem.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <SheetClose asChild>
                        <button
                          onClick={() => router.push(item.href)}
                          className="text-sm font-medium text-neutral-600 hover:text-[#ffa458] transition-colors w-full text-left"
                        >
                          {item.label}
                        </button>
                      </SheetClose>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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
                className="bg-[#ffa458] hover:bg-[#fc8e33] shadow-lg shadow-orange-200/50 transition-all duration-300"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Checkout Modal */}
      <div className="w-full h-full py-[50px]">
        {user && (
          <CheckoutModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setShowOrderPopup(false);
              setCheckingOut(false);
            }}
            onConfirm={handlePayStakc}
            address={{
              location: user?.businessAddress,
              phone: user?.phone,
              fullName: user?.businessName,
            }}
            amount={totalPrice}
          />
        )}
      </div>
    </nav>
  );
}

export default NavBar;
