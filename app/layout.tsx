import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: {
    default: "Alivenow Official Blog - Case studies, examples and more.",
    template: "%s | AliveNow",
  },
  description:
    "Discover the latest insights, tutorials, and stories from our community of writers. Stay updated with trending topics and expert opinions.",
  keywords: [
    "blog",
    "articles",
    "insights",
    "tutorials",
    "technology",
    "lifestyle",
  ],
  authors: [{ name: "AliveNow Team" }],
  creator: "AliveNow",
  publisher: "AliveNow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://clownfish-app-v6pxe.ondigitalocean.app"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "AliveNow - Latest Insights & Stories",
    description:
      "Discover the latest insights, tutorials, and stories from our community of writers.",
    siteName: "AliveNow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AliveNow - Latest Insights & Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AliveNow - Latest Insights & Stories",
    description:
      "Discover the latest insights, tutorials, and stories from our community of writers.",
    images: ["/og-image.jpg"],
    creator: "@alivenow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  generator: "AliveNow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'