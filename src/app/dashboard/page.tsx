import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Developer Dashboard & API Gateway | FreeAPI.dev',
  description: '18 zengin veri setine, mikro-saniye hızında (<2ms) LRU bellek önbelleğine ve sıfır bayat veri garantili otomatik senkronizasyona sahip kurumsal API Gateway.',
  alternates: {
    canonical: 'https://freeapi.website/dashboard',
    languages: {
      'en': 'https://freeapi.website/en/dashboard',
      'tr': 'https://freeapi.website/dashboard',
    },
  },
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50/50 dark:bg-zinc-950/50 text-stone-900 dark:text-zinc-100">
        <DashboardClient />
      </main>
    </>
  );
}
