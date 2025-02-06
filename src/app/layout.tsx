import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { FC, PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Book time to meet",
  description: "Add a meeting directly to Google Calendar",
};

const RootLayout: FC<Readonly<PropsWithChildren>> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
