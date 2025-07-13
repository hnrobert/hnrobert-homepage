import React from "react";
import "./globals.css";

export const metadata = {
  title: "HNRobert's Homepage",
  description:
    "Personal website of HNRobert",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
