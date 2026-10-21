// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freshora | Fresh groceries delivered",
  description:
    "Shop fruits, vegetables, rice, flour, dairy and everyday essentials with Freshora.",
  openGraph: {
    title: "Freshora — Freshness for every day",
    description:
      "Your everyday grocery essentials, all in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}