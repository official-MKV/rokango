import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/Components/ui/use-toast";
import { db, auth } from "@/lib/firebase";

export function useFirebaseQuery(collectionName, filters = {}) {
  return useQuery({
    queryKey: [collectionName, filters],
    queryFn: async () => {
      let q = collection(db, collectionName);
      Object.entries(filters).forEach(([key, filterValue]) => {
        if (filterValue && typeof filterValue === "object") {
          const { value, matchType } = filterValue;
          if (value) {
            switch (matchType) {
              case "exact":
                q = query(q, where(key, "==", value));
                break;
              case "startsWith":
                q = query(
                  q,
                  orderBy(key),
                  startAt(value),
                  endAt(value + "\uf8ff")
                );
                break;
              case "contains":
                const lowerValue = value.toLowerCase();
                q = query(
                  q,
                  orderBy(key),
                  startAt(lowerValue),
                  endAt(lowerValue + "\uf8ff")
                );
                break;
              default:
                q = query(q, where(key, "==", value));
            }
          }
        } else if (filterValue) {
          q = query(q, where(key, "==", filterValue));
        }
      });

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid); // Assuming user.id should be user.uid
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ ...user, ...docSnap.data() });
          } else {
            console.log("No such document!");
            setUser(user);
          }
        } catch (error) {
          console.error("Error getting document:", error);
          setUser(user); // Still setting the user even if the document retrieval fails
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export const useCart = (userId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const cartsRef = collection(db, "carts");
      const q = query(
        cartsRef,
        where("userId", "==", userId),
        where("ordered", "==", false)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        return { id: cartDoc.id, ...cartDoc.data() };
      }
      return null;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createCartMutation = useMutation({
    mutationFn: async (newCart) => {
      const docRef = await addDoc(collection(db, "carts"), {
        ordered: false,
        ...newCart,
      });
      return { id: docRef.id, ...newCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", userId], data);
    },
    onError: (error) => {
      console.error("Error creating cart:", error);
      toast({
        title: "Error",
        description: "Failed to create cart. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ cartId, newCart }) => {
      await updateDoc(doc(db, "carts", cartId), newCart);
      return { id: cartId, ...newCart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart", userId], data);
    },
    onError: (error) => {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const addToCart = async (product) => {
    let cart = cartQuery.data;
    if (!cart) {
      cart = await createCartMutation.mutateAsync({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.id === product.id);
    let newItems;

    if (existingItem) {
      newItems = cart.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...cart.items, { ...product, quantity: 1 }];
    }

    await updateCartMutation.mutateAsync({
      cartId: cart.id,
      newCart: { ...cart, items: newItems },
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
      duration: 2000,
    });
  };

  const updateQuantity = async (productId, change) => {
    if (!cartQuery.data) return;

    const newItems = cartQuery.data.items
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);

    await updateCartMutation.mutateAsync({
      cartId: cartQuery.data.id,
      newCart: { ...cartQuery.data, items: newItems },
    });
  };

  const removeItem = async (productId) => {
    if (!cartQuery.data) return;

    const newItems = cartQuery.data.items.filter(
      (item) => item.id !== productId
    );

    await updateCartMutation.mutateAsync({
      cartId: cartQuery.data.id,
      newCart: { ...cartQuery.data, items: newItems },
    });
  };

  return {
    cart: cartQuery.data?.items || [],
    cartId: cartQuery.data?.id,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addToCart,
    updateQuantity,
    removeItem,
  };
};
