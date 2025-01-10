import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/auth/auth-provider";
import QueryProvider from "@/components/query-provider";
import { SWRProvider } from "@/components/swr-config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Task View",
  description: "Task View is a simple task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <SWRProvider>
              <SidebarLayout>{children}</SidebarLayout>
            </SWRProvider>
          </AuthProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
