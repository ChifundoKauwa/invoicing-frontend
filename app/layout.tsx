import type { Metadata } from "next";
import { Inter, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/auth-context";
import MobileNav from "@/app/components/mobile-nav";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "Invoicing App",
  description: "Professional invoicing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} ${orbitron.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
