"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFirebaseQuery, useCart } from "@/hooks/firebase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Star } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/firebase";

const ProductPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { user, loading: authLoading } = useAuth();

  const {
    cart,
    isLoading: cartLoading,
    isError: cartError,
    addToCart,
    updateQuantity,
  } = useCart(user?.uid);

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Product not found");
      }
    },
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useFirebaseQuery("reviews", { productId: id });

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    }
  };

  useEffect(() => {
    if (cart && product) {
      const cartItem = cart.find((item) => item.id === product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    }
  }, [cart, product]);

  if (productLoading || reviewsLoading || authLoading || cartLoading)
    return <div>Loading...</div>;
  if (productError)
    return <div>Error loading product: {productError.message}</div>;
  if (reviewsError)
    return <div>Error loading reviews: {reviewsError.message}</div>;
  if (cartError) return <div>Error loading cart: {cartError.message}</div>;
  if (!product) return <div>Product not found</div>;

  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  return (
    <div className="relative w-full min-h-screen p-8">
      <div className="w-full flex md:flex-row flex-col mb-12">
        <div className="md:w-2/3 relative h-[50vh] w-full pr-8">
          <div className="w-full h-[50vh] relative rounded-[30px] flex items-center justify-center bg-[#faf0e4]">
            <img
              src={product.image || "/assets/earphones_b_1.webp"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="md:w-1/3 relative  w-full flex flex-col justify-between">
          <div>
            <span className="text-sm text-gray-500">{product.brand}</span>
            <span className="ml-4 text-sm text-gray-500">ID: {product.id}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold mb-4">₦{product.price}</p>
            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Button
              className="w-full bg-[#ffa459] hover:bg-[#fc7b12] text-white"
              onClick={handleAddToCart}
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews?.length ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(review.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {review.reviewerName}
                </span>
              </div>
              <p className="text-gray-700">{review.reviewText}</p>
              <span className="text-sm text-gray-500">
                {new Date(review.date.seconds * 1000).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
