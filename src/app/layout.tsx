import React from "react";
import "./globals.css";

export const metadata = {
  title: "HNRobert's Homepage",
  description: "Personal website of HNRobert",
  robots: "index, follow",
  keywords: "HNRobert, developer, full-stack, portfolio, website",
  authors: [{ name: "HNRobert" }],
  openGraph: {
    title: "HNRobert's Homepage",
    description: "Personal website of HNRobert - Full-stack developer",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
