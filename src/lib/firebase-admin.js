import admin from "firebase-admin";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

if (!admin.apps.length) {
  try {
    console.log("This shit is running");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        ),
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { db, auth, storage };
