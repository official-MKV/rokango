// pages/api/addRetailer/route.js
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

export async function POST(req) {
  if (req.method === "POST") {
    try {
      const formData = await req.formData();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.get("email"),
        formData.get("password")
      );
      const uid = userCredential.user.uid;
      let pictureUrl = null;
      if (formData.get("picture")) {
        const pictureRef = ref(storage, `retailer-pictures/${uid}`);
        await uploadBytes(pictureRef, formData.get("picture"));
        pictureUrl = await getDownloadURL(pictureRef);
      }
      const userData = {
        id: uid,
        name: formData.get("name"),
        businessName: formData.get("businessName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        businessAddress: formData.get("businessAddress"),
        role: "retailer",
        picture: pictureUrl,
      };

      await addDoc(collection(db, "users"), userData);

      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error adding retailer:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
