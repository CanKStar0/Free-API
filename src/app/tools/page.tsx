import React from 'react';
import { Metadata } from 'next';
import ToolsHubClient from '@/components/tools/ToolsHubClient';

export const metadata: Metadata = {
  title: 'Geliştirici Araçları & Yerel API Motoru | FreeAPI Dev Tools',
  description: '0ms gecikmeli yerel geliştirici araçları. UUID üretici, JSON formatter, Base64 dönüştürücü, QR kod motoru, şifre üretici ve açık REST API.',
  alternates: {
    canonical: 'https://freeapi.website/tools',
    languages: {
      'tr-TR': 'https://freeapi.website/tools',
      'en-US': 'https://freeapi.website/en/tools',
    },
  },
  openGraph: {
    title: 'Geliştirici Araçları & Yerel API Motoru | FreeAPI',
    description: '0ms gecikmeli yerel geliştirici araçları. Tarayıcıda kullanın veya REST API ile çağırın.',
    url: 'https://freeapi.website/tools',
    siteName: 'FreeAPI',
    type: 'website',
  },
};

export default function ToolsPage() {
  return <ToolsHubClient lang="tr" />;
}
