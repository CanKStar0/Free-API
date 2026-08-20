import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';

export const metadata: Metadata = {
  title: 'FreeAPI Directory - Discover 500+ Public & Free REST APIs for Developers',
  description: 'Explore the curated catalog of 500+ free, public REST APIs with zero authentication, instant code snippets, and live documentation.',
  alternates: {
    canonical: 'https://api.canpolatkaya.com/en',
    languages: {
      'tr-TR': 'https://api.canpolatkaya.com',
      'en-US': 'https://api.canpolatkaya.com/en',
    },
  },
};

export default function EnglishHome() {
  return (
    <>
      <Hero />
      <CategoryGrid />
    </>
  );
}
