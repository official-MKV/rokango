const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Replace with the path to your service account key JSON file
const serviceAccount = require("./rokango-6f375-firebase-adminsdk-h514c-86e9203327.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const orders = [
  {
    order_id: "ORD001",
    date_created: new Date(2023, 6, 1),
    date_ordered: new Date(2023, 6, 1),
    delivery_location: "123 Main St, Anytown, USA",
    retailer_name: "TechGadgets Inc.",
    items: [
      { name: "Laptop Stand", quantity: 1, price: 29.99 },
      { name: "Wireless Mouse", quantity: 1, price: 19.99 },
    ],
    delivered: false,
  },
  {
    order_id: "ORD002",
    date_created: new Date(2023, 6, 2),
    date_ordered: new Date(2023, 6, 2),
    delivery_location: "456 Elm St, Othertown, USA",
    retailer_name: "OfficeSupplies Co.",
    items: [
      { name: "Ergonomic Chair", quantity: 1, price: 199.99 },
      { name: "Desk Organizer", quantity: 2, price: 14.99 },
    ],
    delivered: true,
  },
  {
    order_id: "ORD003",
    date_created: new Date(2023, 6, 3),
    date_ordered: new Date(2023, 6, 3),
    delivery_location: "789 Oak Rd, Somewhere, USA",
    retailer_name: "ElectronicsPro",
    items: [
      { name: "4K Monitor", quantity: 1, price: 299.99 },
      { name: "Mechanical Keyboard", quantity: 1, price: 89.99 },
    ],
    delivered: false,
  },
  {
    order_id: "ORD004",
    date_created: new Date(2023, 6, 4),
    date_ordered: new Date(2023, 6, 4),
    delivery_location: "101 Pine Lane, Elsewhere, USA",
    retailer_name: "TechGadgets Inc.",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 149.99 },
      { name: "USB-C Hub", quantity: 1, price: 39.99 },
    ],
    delivered: true,
  },
  {
    order_id: "ORD005",
    date_created: new Date(2023, 6, 5),
    date_ordered: new Date(2023, 6, 5),
    delivery_location: "202 Cedar Blvd, Anyplace, USA",
    retailer_name: "OfficeSupplies Co.",
    items: [
      { name: "Standing Desk", quantity: 1, price: 399.99 },
      { name: "Desk Lamp", quantity: 1, price: 29.99 },
      { name: "Cable Management Kit", quantity: 1, price: 19.99 },
    ],
    delivered: false,
  },
];

async function addOrders() {
  for (const order of orders) {
    try {
      const docRef = await db.collection("orders").add(order);
      console.log(`Added order ${order.order_id} with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error adding order ${order.order_id}:`, error);
    }
  }
}

addOrders()
  .then(() => {
    console.log("Finished adding orders");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error in script execution:", error);
    process.exit(1);
  });
