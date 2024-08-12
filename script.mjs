require("dotenv").config();
import fetch from "node-fetch";
function getDefaultMessage(messageType) {
  switch (messageType) {
    case "New Order":
      return "You have received a new order.";
    // Add other cases as needed
    default:
      return "No message content available.";
  }
}

async function sendTermiiMessage(to, messageType, customMessage) {
  const messageContent = customMessage || getDefaultMessage(messageType);

  const data = {
    to: to,
    from: "Rokango",
    sms: messageContent,
    type: "plain",
    api_key: process.env.TERMII_API_KEY,
    channel: "generic",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(
      `${process.env.TERMII_BASE_URL}/api/sms/send`,
      options
    );

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Response:", responseText);
      throw new Error(
        `Failed to send message: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending Termii message:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

// Example usage
data = sendTermiiMessage(
  "+2349056595381",
  "New Order",
  `You have a new order from  Order ID: }`
)
  .then((result) => {
    console.log("Message sent successfully:", result);
  })
  .catch((error) => {
    console.error("Failed to send message:", error);
    console.error("Error stack:", error.stack);
  });

console.log(data);
