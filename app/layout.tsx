import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Irshadul Anam Madrasa — Academic Portal",
    template: "%s | Irshadul Anam Madrasa",
  },
  description:
    "Digital academic portal for Irshadul Anam Madrasa. Access results, notes, question papers, timetables, and announcements.",
  keywords: [
    "Irshadul Anam Madrasa",
    "Islamic education",
    "student portal",
    "madrasa results",
    "academic portal",
  ],
  authors: [{ name: "Irshadul Anam Madrasa" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IAM Portal",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Irshadul Anam Madrasa",
    title: "Irshadul Anam Madrasa — Academic Portal",
    description:
      "Digital academic portal for students, parents, and teachers.",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
