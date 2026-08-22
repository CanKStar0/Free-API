import React from 'react';
import { Metadata } from 'next';
import ToolsHubClient from '@/components/tools/ToolsHubClient';

export const metadata: Metadata = {
  title: 'Developer Tools & Local Edge API Hub | FreeAPI Dev Tools',
  description: 'Zero latency developer tools. UUID generator, JSON formatter & validator, Base64 encoder/decoder, QR code engine, password generator and open REST APIs.',
  alternates: {
    canonical: 'https://freeapi.website/en/tools',
    languages: {
      'tr-TR': 'https://freeapi.website/tools',
      'en-US': 'https://freeapi.website/en/tools',
    },
  },
  openGraph: {
    title: 'Developer Tools & Local Edge API Hub | FreeAPI',
    description: 'Zero latency developer tools. Use directly in browser or call via open REST API.',
    url: 'https://freeapi.website/en/tools',
    siteName: 'FreeAPI',
    type: 'website',
  },
};

export default function EnToolsPage() {
  return <ToolsHubClient lang="en" />;
}
