import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nextport AI — Import Compliance Control Tower",
  description:
    "AI-powered control tower for Mexican import operations and trade compliance. Classify documents, detect exceptions, and get pedimento-ready.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
