import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Developer Dashboard & API Gateway | FreeAPI.dev',
  description: 'Ultra-fast (<2ms) enterprise API gateway providing 18 high-density datasets with custom TTL revalidation and automatic proxy fallback.',
  alternates: {
    canonical: 'https://freeapi.website/en/dashboard',
    languages: {
      'en': 'https://freeapi.website/en/dashboard',
      'tr': 'https://freeapi.website/dashboard',
    },
  },
};

export default function EnDashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50/50 dark:bg-zinc-950/50 text-stone-900 dark:text-zinc-100">
        <DashboardClient />
      </main>
    </>
  );
}
