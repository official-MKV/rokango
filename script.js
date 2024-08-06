require("dotenv").config();
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} = require("firebase/firestore");

// Initialize Firebase (make sure to replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testDataSet = [
  {
    recipient: "3OflN7znNRhBiLJMo9EPDmIKDXd2",
    type: "new_order",
    order_id: "ORDER123",
    message:
      "You have a new order mrom the king of rome a new order from customer1@example.com",
    created_at: Timestamp.now(),
    read: false,
  },
];

async function sendNotificationsToFirebase() {
  const notificationsRef = collection(db, "notifications");

  for (const testData of testDataSet) {
    try {
      const docRef = await addDoc(notificationsRef, testData);
      console.log("Notification sent successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
}

sendNotificationsToFirebase();
