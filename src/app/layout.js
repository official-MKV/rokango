import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import localFont from "next/font/local";
import { Toaster } from "@/Components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rokango",
  description:
    "Shop directly from manufacturers and local suppliers with our B2B platform. Our website connects retailers with a vast network of producers, offering competitive prices, a diverse range of quality products, and secure transactions. Streamline your supply chain, reduce costs, and discover unique items tailored to your business needs. Join our platform today and experience the benefits of direct sourcing, wide product selection, and reliable service. Enhance your retail operations with us and grow your business efficiently",
};

const helveticaNeue = localFont({
  src: [
    {
      path: "../../public/fonts/HelveticaNeueUltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeueMedium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeueRoman.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-helvetica-neue",
});
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${helveticaNeue.variable} font-sans`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
