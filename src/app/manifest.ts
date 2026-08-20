import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Free-API Directory',
    short_name: 'FreeAPI',
    description: 'Verified public developer API directory across 28+ categories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#9e0a2b',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
