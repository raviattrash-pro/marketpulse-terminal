import './globals.css';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://marketpulse-terminal.vercel.app'),
  title: 'MarketPulse - Real-time NSE/BSE Intelligence & Educational Analytics',
  description: 'Educational stock valuation, options payoff simulation, Smart Money Concepts order blocks & financial literacy platform.',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MarketPulse',
  },
  icons: {
    icon: '/icons/icon.svg',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  verification: {
    google: 'google00f9059f5265dae5',
  },
  openGraph: {
    title: 'MarketPulse - Real-time NSE/BSE Intelligence & Aladdin Wealth Advisory',
    description: 'Institutional-grade multi-asset advisory, Smart Money Concepts (SMC), Benjamin Graham valuations, and live Indian market intelligence.',
    url: 'https://marketpulse-terminal.vercel.app',
    siteName: 'MarketPulse Terminal',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'MarketPulse Terminal Social Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketPulse Terminal - Institutional Wealth Advisory & Trading Copilot',
    description: 'Real-time Indian financial terminal & PWA copilot with Smart Money Concepts, Graham Intrinsic Values, and live NSE/BSE feeds.',
    images: ['/social-preview.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
