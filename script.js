const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Replace with the path to your service account key JSON file
const serviceAccount = require("./rokango-6f375-firebase-adminsdk-h514c-86e9203327.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const reviews = [
  {
    productId: "3b6jq8vgezJlN4za9B6U",
    rating: 4,
    reviewText: "Very comfortable chair, great lumbar support!",
    reviewerName: "John Doe",
    date: new Date(2023, 5, 15),
  },
  {
    productId: "64Qgq1EwuSoazFYekesE",
    rating: 5,
    reviewText: "Excellent webcam, crystal clear video quality.",
    reviewerName: "Jane Smith",
    date: new Date(2023, 6, 2),
  },
  {
    productId: "7Lqt3A4MQToAacloG5bB",
    rating: 4,
    reviewText: "Good standing desk converter, easy to adjust.",
    reviewerName: "Mike Johnson",
    date: new Date(2023, 5, 28),
  },
  {
    productId: "8bZbAo7ZCYOZI1PETia2",
    rating: 3,
    reviewText: "Charges well but a bit slow for newer phones.",
    reviewerName: "Sarah Williams",
    date: new Date(2023, 6, 10),
  },
  {
    productId: "A6XO2wJXUG1l18cfeSus",
    rating: 5,
    reviewText: "Great USB-C hub, all ports work perfectly.",
    reviewerName: "David Brown",
    date: new Date(2023, 6, 5),
  },
  {
    productId: "CEZSMaWsRh5MP6DtrJS0",
    rating: 4,
    reviewText: "Nice desk organizer, keeps everything tidy.",
    reviewerName: "Emily Chen",
    date: new Date(2023, 5, 20),
  },
  {
    productId: "Jn4EY6lWd4HfdqIUHqzE",
    rating: 5,
    reviewText: "Sturdy laptop stand, improved my posture.",
    reviewerName: "Alex Turner",
    date: new Date(2023, 6, 8),
  },
  {
    productId: "WOT8ArHIWuEcHnLcS9zp",
    rating: 4,
    reviewText: "Comfortable keyboard, reduced wrist strain.",
    reviewerName: "Olivia Martinez",
    date: new Date(2023, 5, 25),
  },
  {
    productId: "atPGyTgMgx22T3qSPIrO",
    rating: 5,
    reviewText: "Smooth and responsive wireless mouse.",
    reviewerName: "Ethan Wilson",
    date: new Date(2023, 6, 12),
  },
  {
    productId: "dPDvwynacvZflMdLRAQc",
    rating: 5,
    reviewText: "Powerful laptop, handles all my work tasks with ease.",
    reviewerName: "Sophia Lee",
    date: new Date(2023, 5, 30),
  },
  {
    productId: "eJLczIwnGDey9g7Nn8YI",
    rating: 4,
    reviewText: "Good desk lamp, multiple light settings are useful.",
    reviewerName: "Liam Garcia",
    date: new Date(2023, 6, 3),
  },
  {
    productId: "f28Bc3mOO590VgP0ko5J",
    rating: 4,
    reviewText: "Nice keyboard, backlight is great for late nights.",
    reviewerName: "Ava Robinson",
    date: new Date(2023, 5, 22),
  },
  {
    productId: "jFOMjy9d0I5XuFzLdHd3",
    rating: 5,
    reviewText: "Excellent portable monitor, perfect for travel.",
    reviewerName: "Noah Thompson",
    date: new Date(2023, 6, 7),
  },
  {
    productId: "uzghEignc4DhP0l3TXk5",
    rating: 5,
    reviewText: "Amazing noise-cancelling, great for focus.",
    reviewerName: "Emma White",
    date: new Date(2023, 5, 18),
  },
  {
    productId: "3b6jq8vgezJlN4za9B6U",
    rating: 3,
    reviewText: "Decent chair, but could use more padding.",
    reviewerName: "Daniel Kim",
    date: new Date(2023, 6, 14),
  },
  {
    productId: "64Qgq1EwuSoazFYekesE",
    rating: 4,
    reviewText: "Good webcam, but struggles in low light.",
    reviewerName: "Isabella Rodriguez",
    date: new Date(2023, 5, 27),
  },
  {
    productId: "7Lqt3A4MQToAacloG5bB",
    rating: 5,
    reviewText: "Love this standing desk converter, very sturdy.",
    reviewerName: "William Taylor",
    date: new Date(2023, 6, 1),
  },
  {
    productId: "8bZbAo7ZCYOZI1PETia2",
    rating: 4,
    reviewText: "Fast charging, works well with my phone.",
    reviewerName: "Mia Anderson",
    date: new Date(2023, 5, 23),
  },
  {
    productId: "A6XO2wJXUG1l18cfeSus",
    rating: 3,
    reviewText: "USB-C hub works, but gets quite hot.",
    reviewerName: "James Moore",
    date: new Date(2023, 6, 9),
  },
  {
    productId: "CEZSMaWsRh5MP6DtrJS0",
    rating: 5,
    reviewText: "Perfect organizer, lots of compartments.",
    reviewerName: "Charlotte Davis",
    date: new Date(2023, 5, 19),
  },
  {
    productId: "Jn4EY6lWd4HfdqIUHqzE",
    rating: 4,
    reviewText: "Good laptop stand, wish it was a bit more adjustable.",
    reviewerName: "Benjamin Wilson",
    date: new Date(2023, 6, 6),
  },
  {
    productId: "WOT8ArHIWuEcHnLcS9zp",
    rating: 5,
    reviewText: "Best ergonomic keyboard I've used.",
    reviewerName: "Amelia Thompson",
    date: new Date(2023, 5, 29),
  },
  {
    productId: "atPGyTgMgx22T3qSPIrO",
    rating: 4,
    reviewText: "Good mouse, but scroll wheel is a bit loud.",
    reviewerName: "Elijah Harris",
    date: new Date(2023, 6, 11),
  },
  {
    productId: "dPDvwynacvZflMdLRAQc",
    rating: 4,
    reviewText: "Great laptop, but fan can get noisy under load.",
    reviewerName: "Harper Martin",
    date: new Date(2023, 5, 24),
  },
  {
    productId: "eJLczIwnGDey9g7Nn8YI",
    rating: 5,
    reviewText: "Fantastic desk lamp, love the adjustable arm.",
    reviewerName: "Lucas Garcia",
    date: new Date(2023, 6, 4),
  },
  {
    productId: "f28Bc3mOO590VgP0ko5J",
    rating: 3,
    reviewText: "Keyboard is okay, keys are a bit mushy for my taste.",
    reviewerName: "Evelyn Clark",
    date: new Date(2023, 5, 21),
  },
  {
    productId: "jFOMjy9d0I5XuFzLdHd3",
    rating: 4,
    reviewText: "Good portable monitor, colors could be more vibrant.",
    reviewerName: "Henry Rodriguez",
    date: new Date(2023, 6, 13),
  },
  {
    productId: "uzghEignc4DhP0l3TXk5",
    rating: 5,
    reviewText: "These headphones are a game-changer for productivity.",
    reviewerName: "Scarlett Wright",
    date: new Date(2023, 5, 26),
  },
  {
    productId: "3b6jq8vgezJlN4za9B6U",
    rating: 5,
    reviewText: "Absolutely love this chair, worth every penny!",
    reviewerName: "Logan Baker",
    date: new Date(2023, 6, 15),
  },
  {
    productId: "64Qgq1EwuSoazFYekesE",
    rating: 4,
    reviewText: "Solid webcam, good for daily video calls.",
    reviewerName: "Grace Turner",
    date: new Date(2023, 5, 17),
  },
];

async function addReviews() {
  for (const review of reviews) {
    try {
      const docRef = await db.collection("reviews").add(review);
      console.log(
        `Added review for product ${review.productId} with ID: ${docRef.id}`
      );
    } catch (error) {
      console.error(
        `Error adding review for product ${review.productId}:`,
        error
      );
    }
  }
}

addReviews()
  .then(() => {
    console.log("Finished adding reviews");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
  });
