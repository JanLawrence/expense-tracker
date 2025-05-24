import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import Container from "./container";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetroNext Admin",
  description: "MetroNext Admin Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Container>{children}</Container>
    </Providers>
  );
}