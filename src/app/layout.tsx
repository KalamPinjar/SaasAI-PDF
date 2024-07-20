import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
    
    lang="en" suppressHydrationWarning>
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased light-grainy dark:dark-grainy dark:bg-[url('/dark.png')] ",
            inter.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="light" >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
