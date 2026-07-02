import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "StudyQuest — Level Up Your Mind",
  description: "StudyQuest is a premium gamified productivity platform. Manage your studies like role-playing game missions with Apple and Vercel-like design aesthetics.",
};

import { AuthProvider } from "@/providers/AuthProvider";
import { ToastContainer } from "@/components/ui/toast-container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary selection:bg-accent/20">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

