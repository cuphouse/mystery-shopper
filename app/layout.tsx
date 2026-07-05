import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecoScout",
  description:
    "Simulate buyer questions and see whether answer engines recommend your business or your competitors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
