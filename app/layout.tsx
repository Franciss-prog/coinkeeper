import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], 
});

export const metadata: Metadata = {
  title: "CoinKeeper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <nav className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="px-2 text-lg font-semibold" asChild>
                    <Link href="/">CoinKeeper</Link>
                  </Button>
                </div>
                <ModeToggle />
              </div>
            </nav>
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
  