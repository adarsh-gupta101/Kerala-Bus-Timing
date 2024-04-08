import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kerala Vandi",
  description: "Get the details of All the Buses Running in Kerala using Kerala Vandi",
  url: "https://keralavandi.adarsh-gupta.in",
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
