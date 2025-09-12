import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
