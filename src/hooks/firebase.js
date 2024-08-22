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
  startAfter,
  orderBy,
  startAt,
  endAt,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/Components/ui/use-toast";
import { db, auth } from "@/lib/firebase";

export function useFirebaseQuery(collectionName, options = {}) {
  const {
    filters = {},
    page = 1,
    pageSize = 20,
    searchField,
    searchTerm,
    orderByField = "createdAt",
    orderDirection = "desc",
  } = options;

  return useQuery({
    queryKey: [
      collectionName,
      filters,
      page,
      pageSize,
      searchField,
      searchTerm,
      orderByField,
      orderDirection,
    ],
    queryFn: async () => {
      let q = collection(db, collectionName);

      // Apply filters

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          q = query(q, where(key, "==", value));
        }
      });

      // Apply search if searchField and searchTerm are provided
      if (searchField && searchTerm) {
        console.log("search field is running");
        q = query(
          q,
          // orderBy(searchField),
          where(searchField, ">=", searchTerm),
          where(searchField, "<=", searchTerm + "\uf8ff")
        );
      }

      // Get total count (this is an extra query, so use cautiously)
      const totalSnapshot = await getDocs(q);
      const totalItems = totalSnapshot.size;

      // Apply ordering
      // q = query(q, orderBy(orderByField, orderDirection));

      // Apply pagination
      if (page > 1) {
        const prevPageQuery = query(q, limit((page - 1) * pageSize));
        const prevPageDocs = await getDocs(prevPageQuery);
        const lastVisible = prevPageDocs.docs[prevPageDocs.docs.length - 1];
        q = query(q, startAfter(lastVisible));
      }
      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      return {
        items,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize,
      };
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
    toast({
      title: "Product added",
      description: `${product.name} added to your cart.`,
      duration: 2000,
    });

    await updateCartMutation.mutateAsync({
      cartId: cart.id,
      newCart: { ...cart, items: newItems },
    });
  };

  const updateQuantity = async (productId, change) => {
    let cart = cartQuery.data;

    if (!cart) return;
    console.log(cart);

    const existingItem = cart.items.find((item) => item.id === productId);
    let newItems;

    if (existingItem) {
      const newQuantity = Math.max(0, existingItem.quantity + change);
      if (newQuantity === 0) {
        newItems = cart.items.filter((item) => item.id !== productId);
      } else {
        newItems = cart.items.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }
    } else if (change) {
      const docRef = doc(db, "products", productId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const product = docSnapshot.data();
        newItems = [...cart.items, { ...product, quantity: 1, id: productId }];
      } else {
        console.error(`Product with id ${productId} not found`);
        return;
      }
    } else {
      return;
    }

    // Update the cart
    await updateCartMutation.mutateAsync({
      cartId: cart.id,
      newCart: { ...cart, items: newItems },
    });

    // If the cart becomes empty after this operation, you might want to delete it
    if (newItems.length === 0) {
      await deleteCartMutation.mutateAsync(cart.id);
    }
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
