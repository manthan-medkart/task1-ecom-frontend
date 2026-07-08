import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedKart - Premium E-Commerce Medical Supplies Shop",
  description: "A professional e-commerce platform for diagnostic tools, monitoring devices, and clinical supplies. Built with Next.js and integrated with Spring Boot.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 transition-colors">
        <AppProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
