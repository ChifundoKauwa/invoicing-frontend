import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/auth-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
        className={`${inter.variable} ${mono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur">
              <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-semibold text-white">
                    IA
                  </span>
                  <span className="text-sm font-semibold text-white">
                    Invoicing App
                  </span>
                </div>
                <nav className="flex items-center gap-4 text-xs sm:text-sm">
                  <a href="/" className="text-white hover:text-white/80">
                    Home
                  </a>
                  <a href="/login" className="text-white hover:text-white/80">
                    Sign in
                  </a>
                  <a
                    href="/register"
                    className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Get started
                  </a>
                </nav>
              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>

            <footer className="border-t border-gray-900 bg-gray-950/80">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-gray-500 sm:text-sm">
                <span>
                  © {new Date().getFullYear()} Invoicing App. All rights reserved.
                </span>
                <span className="hidden sm:inline">
                  Built with Next.js &amp; a Supabase-inspired dark theme.
                </span>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
