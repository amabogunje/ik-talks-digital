import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IK Talks Digital",
  description: "Premium communication and public speaking learning platform for African users."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
