import React from "react";
import "./globals.css";

export const metadata = {
  title: "HNRobert - Full Stack Developer",
  description:
    "Personal website of HNRobert, a full-stack developer passionate about creating innovative solutions.",
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
