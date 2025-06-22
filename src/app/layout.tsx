import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

// Configure the font with the desired weights and subsets
const fredoka = Fredoka({
  subsets: ["latin"], // Specify the character subsets you need
  weight: ["400", "500", "600", "700"], // Specify the font weights you want to use
  display: "swap", // 'swap' is a good default for performance
  variable: "--font-fredoka", // This creates a CSS variable for the font
});

export const metadata: Metadata = {
  title: "Snake & Ladder",
  description: "Play the classic Snake & Ladder game online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable}`}>{children}</body>
    </html>
  );
}
