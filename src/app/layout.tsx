import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarbanes-Oxley Act (SOX) — Complete Guide",
  description:
    "The federal law that changed corporate accountability forever — born from the ashes of Enron, WorldCom, and a decade of Wall Street fraud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
