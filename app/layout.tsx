import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

/* Body text — Inter */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Headings / Nav / Buttons — Inter Tight (PolySans substitute) */
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Stratosphere AI - Cloud Cost Optimization",
  description: "The Money-Saving Robot for Cloud Bills",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${interTight.variable} ${inter.className} bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
