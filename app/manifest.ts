import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The ARC Raiders Hub',
    short_name: 'ARC Raiders Hub',
    description: 'The premier community database, news, and guides for ARC Raiders by Embark Studios.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070b14',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
