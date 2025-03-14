import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { ClientLayout } from "./client-layout";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cooper Stepanian",
  description: "Personal portfolio and professional experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body className={`${inter.className} overflow-x-hidden`}>
        <SupabaseProvider>
          <ClientLayout>
            {children} <Analytics />
          </ClientLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
}
