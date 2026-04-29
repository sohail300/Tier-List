import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const bodyFont = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tier List",
  description: "Build and share your own tier lists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${bodyFont.className} min-h-full flex flex-col`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
