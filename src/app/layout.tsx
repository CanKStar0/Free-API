import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { SearchProvider } from '@/context/SearchContext';
import { Header } from '@/components/Header';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://freeapi.canpolatkaya.com'),
  title: 'Free-API Directory | 500+ Public & Free REST API Catalogue',
  description: 'Verified public REST API directory with one-click cURL, JavaScript, and Python code snippets across 28+ categories.',
  keywords: [
    'ücretsiz API',
    'free api directory',
    'public apis',
    'rest api listesi',
    'developer tools',
    'geliştirici araçları',
    'canpolat kaya'
  ],
  authors: [{ name: 'Canpolat Kaya', url: 'https://canpolatkaya.com' }],
  creator: 'Canpolat Kaya',
  publisher: 'Canpolat Kaya',
  alternates: {
    canonical: 'https://freeapi.canpolatkaya.com',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://freeapi.canpolatkaya.com',
    title: 'Free-API Directory — 500+ Curated Public APIs',
    description: 'A categorized index of public REST APIs with instant code snippets and rate limits.',
    siteName: 'Free-API Directory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free-API Directory | 500+ Public REST APIs',
    description: 'Developer directory with 500+ free APIs, cURL, and Fetch code snippets.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  'name': 'Free-API Directory by Canpolat Kaya',
  'description': 'Curated open-source index of 500+ public developer APIs across 28+ categories.',
  'url': 'https://freeapi.canpolatkaya.com',
  'creator': {
    '@type': 'Person',
    'name': 'Canpolat Kaya',
    'url': 'https://canpolatkaya.com'
  },
  'keywords': 'free apis, public apis, rest api, developer tools',
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
      </head>
      <body className="font-sans antialiased bg-[#F9F9F6] dark:bg-[#09090b] text-[#1c1917] dark:text-[#fafafa]">

        <ThemeProvider>
          <LanguageProvider>
            <SearchProvider>
              <Header />
              <main className="min-h-screen">

                {children}
              </main>
            </SearchProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
