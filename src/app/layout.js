import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rokango",
  description:
    "Shop directly from manufacturers and local suppliers with our B2B platform. Our website connects retailers with a vast network of producers, offering competitive prices, a diverse range of quality products, and secure transactions. Streamline your supply chain, reduce costs, and discover unique items tailored to your business needs. Join our platform today and experience the benefits of direct sourcing, wide product selection, and reliable service. Enhance your retail operations with us and grow your business efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
