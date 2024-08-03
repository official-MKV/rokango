import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

export async function POST(req) {
  if (req.method === "POST") {
    try {
      const formData = await req.formData();

      // Create user account
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.get("email"),
          formData.get("password")
        );
      } catch (authError) {
        console.error("Authentication error:", authError);
        return new Response(
          JSON.stringify({ error: authError.message, code: authError.code }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const uid = userCredential.user.uid;
      console.log("User created with UID:", uid);

      // Upload picture if provided
      let pictureUrl = null;
      if (formData.get("picture")) {
        try {
          const pictureRef = ref(storage, `supplier-pictures/${uid}`);
          await uploadBytes(pictureRef, formData.get("picture"));
          pictureUrl = await getDownloadURL(pictureRef);
        } catch (uploadError) {
          console.error("Picture upload error:", uploadError);
          // Continue without picture if upload fails
        }
      }

      // Prepare user data
      const userData = {
        id: uid,
        name: formData.get("name"),
        businessName: formData.get("businessName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        businessAddress: formData.get("businessAddress"),
        role: "supplier",
        picture: pictureUrl,
      };

      // Add user data to Firestore
      try {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, userData);
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        return new Response(
          JSON.stringify({
            error: "Failed to save user data",
            details: firestoreError.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Unexpected error adding supplier:", error);
      return new Response(
        JSON.stringify({
          error: "An unexpected error occurred",
          details: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
