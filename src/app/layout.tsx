import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { UpdateBanner } from '@/components/UpdateBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'API Showcase | 500+ Ücretsiz API Koleksiyonu — 47 Kategori',
  description: 'Hava durumundan kripto paraya, siber güvenlikten yapay zekaya kadar 47 kategoride 500+ ücretsiz API\'yi keşfedin. v2.0 güncellemesiyle 10 yeni kategori eklendi!',
  keywords: ['API', 'ücretsiz API', 'geliştirici', 'web geliştirme', 'REST API', 'siber güvenlik API', 'yapay zeka API', 'e-ticaret API'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <UpdateBanner />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

