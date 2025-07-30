import React from "react";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";

export const metadata = {
  title: "HNRobert's Homepage",
  description: "Personal website of HNRobert",
  robots: "index, follow",
  keywords: "HNRobert, developer, full-stack, portfolio, website",
  authors: [{ name: "HNRobert" }],
  icons: {
    icon: [
      {
        url: "/assets/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/assets/favicon.ico",
    apple: "/assets/favicon.ico",
  },
  openGraph: {
    title: "HNRobert's Homepage",
    description: "Personal website of HNRobert - Full-stack developer",
    type: "website",
    locale: "en_US",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#222222",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
