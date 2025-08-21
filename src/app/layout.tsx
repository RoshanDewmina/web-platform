import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatWidget } from "@/components/ai/chat-widget";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduLearn - AI-Powered E-Learning Platform",
  description:
    "Learn anything with personalized AI assistance, gamification, and social features",
};

// Avoid static prerender that requires Clerk keys at build time
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <link rel="manifest" href="/manifest.webmanifest" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `,
            }}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              {/* Persistent AI Chat */}
              <ChatWidget />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
