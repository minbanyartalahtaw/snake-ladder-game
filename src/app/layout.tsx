import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fontHeading = Fredoka({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'], // Specify the weights you'll use
  variable: '--font-heading', // This creates a CSS variable
});

// For body text, positions, etc.
const fontBody = Nunito({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-body', // Another CSS variable
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
      <body className={`${fontHeading.variable} ${fontBody.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
