require("dotenv").config();
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const firebaseAdmin = require("firebase-admin");

// Initialize Firebase using service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(
    /\\n/g,
    "\n"
  ),
  client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL}`,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const db = getFirestore();

async function updateUsers() {
  try {
    const usersSnapshot = await db.collection("users").get();
    const batch = db.batch();

    usersSnapshot.forEach((doc) => {
      const userRef = db.collection("users").doc(doc.id);
      batch.update(userRef, { active: true });
    });

    await batch.commit();
    console.log("Successfully updated all users.");
  } catch (error) {
    console.error("Error updating users:", error);
  }
}

updateUsers();
