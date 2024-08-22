"use client";
import React, { useState, useEffect } from "react";
import { useFirebaseQuery } from "@/hooks/firebase";
import { Input } from "@/Components/ui/input";
import { useCart } from "@/hooks/firebase";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { PackageSearch, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const ProductCard = ({ product, onAddToCart }) => {
  const router = useRouter();
  return (
    <Link
      href={`/product/${product.id}`}
      className="w-full flex flex-col items-center justify-between gap-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
    >
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full p-2 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold truncate flex-1">
            {product.name}
          </span>
          <span className="text-sm font-bold">₦{product.price}</span>
        </div>
        <span className="text-xs text-gray-500 truncate">
          {product.description}
        </span>
        <div className="text-xs flex flex-col gap-1 mt-1">
          <span className="flex items-center">
            Brand:
            <span className="ml-1 px-2 py-1 rounded-full bg-[#faf0e4]">
              {product.brand}
            </span>
          </span>
          <span className="flex items-center">
            Supplier:
            <span className="ml-1 px-2 py-1 rounded-full bg-[#faf0e4]">
              {product.supplier.name}
            </span>
          </span>
        </div>
      </div>
      <button
        className="w-full py-2 bg-[#ffa459] text-white font-medium hover:bg-[#fc7b12] transition-colors duration-300"
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(product);
        }}
      >
        Add To Cart
      </button>
    </Link>
  );
};

export default function ShoppingSection({ user }) {
  const [filters, setFilters] = useState({ supplier: "", brand: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [showViewOrderButton, setShowViewOrderButton] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const {
    data: products,
    isLoading: productLoading,
    error,
  } = useFirebaseQuery("products", { active: true });

  const {
    cart,
    cartId,
    isLoading,
    isError,
    addToCart,
    updateQuantity,
    removeItem,
  } = useCart(user.uid);

  useEffect(() => {
    if (cart.length > 0) {
      setShowViewOrderButton(true);
    }
  }, [cart]);

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col relative p-2 justify-center items-center">
      <div className="w-full mb-4 px-2">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      {filteredProducts?.length > 0 ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <PackageSearch size={64} />
          <p className="mt-4 text-xl font-semibold">No products found</p>
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
              disabled={checkingOut}
              className="bg-[#ffa459] hover:bg-[#ff7c11]"
              onClick={() => {
                setCheckingOut(true);
                handleCheckout();
              }}
            >
              CheckOut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showViewOrderButton && (
        <Button
          className="fixed bottom-4 right-4 z-10 bg-[#ffa459] hover:bg-[#fc7b12] shadow-[0px_0px_10px_0px_#ff7913]"
          onClick={() => setShowOrderPopup(true)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> View Order
        </Button>
      )}
    </div>
  );
}
