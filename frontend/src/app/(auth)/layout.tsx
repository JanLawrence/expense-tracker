import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/UI/Menu/Navbar";
import Sidebar from "@/components/UI/Menu/Sidebar";
import Link from 'next/link';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});


export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
      </html>
    );
  }