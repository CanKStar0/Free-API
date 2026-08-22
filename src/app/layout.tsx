import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { SearchProvider } from '@/context/SearchContext';
import { StackProvider } from '@/context/StackContext';
import { Header } from '@/components/Header';
import { FloatingStackBar } from '@/components/FloatingStackBar';
import { StackDrawer } from '@/components/StackDrawer';
import { ExportStackModal } from '@/components/ExportStackModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://freeapi.website'),
  title: 'FreeAPI Directory | 500+ Public & Free API Catalogue',
  description: 'Verified public developer API directory with one-click cURL, JavaScript, and Python code snippets across 28+ categories.',
  keywords: [
    'ücretsiz API',
    'free api directory',
    'public apis',
    'developer apis',
    'api listesi',
    'developer tools',
    'geliştirici araçları',
    'canpolat kaya'
  ],
  authors: [{ name: 'Canpolat Kaya', url: 'https://canpolatkaya.com' }],
  creator: 'Canpolat Kaya',
  publisher: 'Canpolat Kaya',
  alternates: {
    canonical: 'https://freeapi.website',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://freeapi.website',
    title: 'Free-API Directory — 500+ Curated Public APIs',
    description: 'A categorized index of public developer APIs with instant code snippets and rate limits.',
    siteName: 'Free-API Directory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free-API Directory | 500+ Public APIs',
    description: 'Developer directory with 500+ free APIs, cURL, and Fetch code snippets.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  'name': 'Free-API Directory by Canpolat Kaya',
  'description': 'Curated open-source index of 500+ public developer APIs across 28+ categories.',
  'url': 'https://freeapi.website',
  'creator': {
    '@type': 'Person',
    'name': 'Canpolat Kaya',
    'url': 'https://canpolatkaya.com'
  },
  'keywords': 'free apis, public apis, developer apis, developer tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`dark ${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics GA4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KE97PJLGYP"
        />
        <Script
          id="google-analytics-ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KE97PJLGYP', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#F9F9F6] dark:bg-[#09090b] text-[#1c1917] dark:text-[#fafafa]">

        <ThemeProvider>
          <LanguageProvider>
            <SearchProvider>
              <StackProvider>
                {/* Invisible Honeypot Trap for Automated Scrapers */}
                <a
                  href="/api/trap/v1/dump-all-apis"
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                  rel="nofollow"
                >
                  Public API Full Dump JSON
                </a>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <FloatingStackBar />
                <StackDrawer />
                <ExportStackModal />
              </StackProvider>
            </SearchProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
