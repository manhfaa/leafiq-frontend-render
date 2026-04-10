import type { Metadata } from "next";
import { Be_Vietnam_Pro, Sora } from "next/font/google";

import { brand } from "@/constants/brand";

import "./globals.css";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${brand.name} | AI xác thực ảnh lá cây`,
  description: brand.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${sora.variable} ${beVietnam.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
