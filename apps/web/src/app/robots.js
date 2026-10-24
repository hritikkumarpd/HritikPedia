export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/reader/',
          '/checkout/',
          '/api/',
          '/admin/',
          '/_not-found',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
