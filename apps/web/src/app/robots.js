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
          '/search',
          '/_not-found',
        ],
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: [
          '/',
          '/notes',
          '/subjects',
          '/articles',
          '/free-resources',
          '/about',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: [
          '/dashboard/',
          '/reader/',
          '/checkout/',
          '/api/',
          '/admin/',
          '/search',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
