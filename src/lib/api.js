import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import { orderBy } from "firebase/firestore";
import { auth, db, storage } from "./firebase";

export const fetchRetailers = async (searchTerm = "") => {
  const retailersRef = collection(db, "users");
  let q;

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    q = query(
      retailersRef,
      where("role", "==", "retailer"),
      where("nameLower", ">=", lowerSearchTerm),
      where("nameLower", "<=", lowerSearchTerm + "\uf8ff")
    );
  } else {
    q = query(
      retailersRef,
      where("role", "==", "retailer"),
      orderBy("nameLower")
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const fetchRetailerById = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Retailer not found");
  }
};
