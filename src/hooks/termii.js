import { useState } from "react";

const useTermiiMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMessageContent = (messageType, customMessage) => {
    if (customMessage) return customMessage;

    switch (messageType) {
      case "New Order":
        return "You have received a new order.";
      case "Order delivered":
        return "Your order has been delivered successfully.";
      case "Order Confirmation":
        return "Your order has been confirmed.";
      case "Order received":
        return "We have received your order.";
      case "Transaction Success":
        return "Your transaction was successful.";
      default:
        return "No message content available.";
    }
  };

  const sendMessage = async ({ to, messageType, customMessage }) => {
    setLoading(true);
    setError(null);

    const messageContent = getMessageContent(messageType, customMessage);

    const data = {
      to,
      from: "Rokango",
      sms: messageContent,
      type: "plain",
      api_key: process.env.TERMII_API_KEY,
      channel: "generic",
    };

    try {
      const response = await fetch(
        `${process.env.TERMII_BASE_URL}/api/sms/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError(err.message || "An unknown error occurred");
      throw err;
    }
  };

  return { sendMessage, loading, error };
};

export default useTermiiMessage;
