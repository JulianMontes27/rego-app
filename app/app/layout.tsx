import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/providers/socket-provider";

// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "Paternina-Montes",
  description:
    "Streamline restaurant billing with our QR code-based payment system. Allow customers to scan, split bills, and pay online, while admins track orders and sales with an intuitive dashboard. No account creation needed, just fast and secure payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <ModalProvider />
            {children}
          </SocketProvider>
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
