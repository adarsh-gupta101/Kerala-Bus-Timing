import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kerala Vandi",
  description: "Get the details of All the Buses Running in Kerala using Kerala Vandi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* logo */}
        <link rel="icon" href="/dle.webp" sizes="any" />
        {/* font */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
