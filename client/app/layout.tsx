import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'

import { Toaster } from "@/components/ui/toaster"
import { BackToTop } from "@/components/layout/back-to-top"

import { SkipNav } from "@/components/layout/skip-nav"
import { StructuredData } from "@/components/providers/structured-data"

import { generateBusinessSchema, generateWebsiteSchema, generateOrganizationSchema, generateServiceSchema } from "@/lib/seo"
import { Providers } from "@/components/providers/providers"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ApolloWrapper } from "@/components/ApolloWrapper"
import { PageTransition } from "@/components/providers/page-transition"
import "./globals.css"

const _geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Savaj Seeds | Premium Quality Seeds – Gujarat",
  description:
    "Premium quality vegetable seeds, crop seeds, and hybrid seeds for optimal farming growth. Trusted seed supplier committed to farmer success with over a decade of agricultural excellence. Leading agricultural solutions provider in Gujarat, India.",
  generator: "Next.js",
  applicationName: "Savaj Seeds",
  referrer: "origin-when-cross-origin",
  keywords: [
    "seeds", "farming", "agriculture", "vegetables", "crops", "hybrid seeds", "gardening",
    "vegetable seeds", "crop seeds", "organic farming", "sustainable agriculture", "Gujarat",
    "India", "seed supplier", "agricultural products", "farming solutions", "quality seeds",
    "high yield seeds", "disease resistant seeds", "drought tolerant seeds", "premium seeds",
    "certified seeds", "plant breeding", "agricultural consulting", "farming technology",
    "seed testing", "agricultural research", "Savaj Seeds", "Ahmedabad", "GIDC",
    "tomato seeds", "cucumber seeds", "pepper seeds", "wheat seeds", "rice seeds", "maize seeds",
    "seasonal farming", "crop management", "agricultural innovation", "farming best practices",
    "seed technology", "plant genetics", "agricultural development", "farming equipment",
    "irrigation solutions", "soil management", "pest control", "fertilizer guidance",
    "harvest optimization", "post-harvest technology", "agricultural training", "farmer education"
  ],
  authors: [{ name: "Savaj Seeds", url: "https://savajseeds.com" }],
  creator: "Savaj Seeds",
  publisher: "Savaj Seeds",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://savajseeds.com',
    title: 'Savaj Seeds - Happiness from the Farmer\'s Field | Premium Quality Seeds',
    description: 'Premium quality vegetable seeds, crop seeds, and hybrid seeds for optimal farming growth. Trusted seed supplier committed to farmer success with over a decade of agricultural excellence.',
    siteName: 'Savaj Seeds',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Savaj Seeds - Premium Quality Seeds for Optimal Farming Growth',
        type: 'image/png',
      },
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Savaj Seeds Agricultural Products - Vegetable, Crop & Hybrid Seeds',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-image-square.jpg',
        width: 1080,
        height: 1080,
        alt: 'Savaj Seeds - Leading Agricultural Solutions Provider',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savaj Seeds - Happiness from the Farmer\'s Field | Premium Quality Seeds',
    description: 'Premium quality vegetable seeds, crop seeds, and hybrid seeds for optimal farming growth. Trusted seed supplier committed to farmer success.',
    creator: '@SavajSeeds',
    site: '@SavajSeeds',
    images: ['/images/logo.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.YANDEX_VERIFICATION || '',
    yahoo: process.env.YAHOO_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
      'facebook-domain-verification': process.env.FACEBOOK_VERIFICATION || '',
      'pinterest-site-verification': process.env.PINTEREST_VERIFICATION || '',
    },
  },
  appleWebApp: {
    title: 'Savaj Seeds',
    statusBarStyle: 'default',
    capable: true,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
  category: 'Agriculture',
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'application-name': 'Savaj Seeds',
    'msapplication-config': '/browserconfig.xml',
    'geo.region': 'IN-GJ',
    'geo.placename': 'Ahmedabad, Gujarat, India',
    'geo.position': '23.0225;72.5714',
    'ICBM': '23.0225, 72.5714',
    'DC.title': 'Savaj Seeds - Premium Quality Seeds',
    'DC.creator': 'Savaj Seeds',
    'DC.subject': 'Agriculture, Seeds, Farming',
    'DC.description': 'Premium quality vegetable seeds, crop seeds, and hybrid seeds for optimal farming growth.',
    'DC.publisher': 'Savaj Seeds',
    'DC.contributor': 'Savaj Seeds Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': 'https://savajseeds.com',
    'DC.language': 'en',
    'DC.coverage': 'India',
    'DC.rights': 'Copyright Savaj Seeds',
  },
}

export const viewport: Viewport = {
  themeColor: '#22c55e',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const businessSchema = generateBusinessSchema()
  const websiteSchema = generateWebsiteSchema()
  const organizationSchema = generateOrganizationSchema()
  const serviceSchema = generateServiceSchema()

  return (
    <html lang="en" className={`${_geist.variable} ${_geistMono.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData data={[businessSchema, websiteSchema, organizationSchema, serviceSchema]} />

        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="HandheldFriendly" content="true" />
      </head>
      <body className={`font-sans antialiased pb-16 md:pb-0`}>

        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipNav />
          <ApolloWrapper>
            <PageTransition>
              {children}
            </PageTransition>
          </ApolloWrapper>
          <BackToTop />

          <Toaster />

          <BottomNav />
          <SpeedInsights />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
