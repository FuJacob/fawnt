import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "find fonts - fawnt",
  description: "Describe what you need, get perfect fonts from Google Fonts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QXX1EYV1W5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QXX1EYV1W5');
          `}
        </Script>
      </head>
      <body className={`${figtree.className} antialiased`}>
        {children}
        <Toaster position="bottom-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
