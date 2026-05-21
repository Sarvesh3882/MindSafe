import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IllustrationBackdrop } from "@/components/shared/illustration-backdrop";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MindSafe India — Campus Mental Wellness Platform",
  description: "AI-powered mental health platform for Indian colleges. NAAC compliant, stigma-free, built for Gen Z.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3DBE29",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <IllustrationBackdrop />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
