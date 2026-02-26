import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { ClerkWarningSuppressor } from '@/components/clerk-warning-suppressor'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AquaSynapse - Intelligent Disaster Response System',
  description: 'AI-powered disaster response command center for real-time risk assessment, resource allocation, and emergency management.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/login"
    >
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <ClerkWarningSuppressor />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
