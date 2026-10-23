import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FlowDesk — Work, in a clearer rhythm", template: "%s — FlowDesk" },
  description: "Turn projects, tasks, and everyday instructions into clear, coordinated work.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
