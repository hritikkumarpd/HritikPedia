import './globals.css';
import { Nunito, Source_Sans_3 } from 'next/font/google';
import { BRAND } from '@hritikpedia/shared/brand';
import AppProviders from '../components/AppProviders';
import { ThemeScript } from '../components/ThemeProvider';

// Nunito for editorial headings, Source Sans 3 for high-legibility body
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Hritikpedia — Computer Science Study Notes, PYQs & Mock Tests',
    template: '%s | Hritikpedia',
  },
  description: BRAND.description,
  keywords: [
    'Hritikpedia',
    'Study Notes',
    'Computer Science Notes',
    'DBMS Notes',
    'Operating System Notes',
    'Bihar STET Computer Science',
    'Digital Logic',
    'Engineering Notes',
    'PYQ Solutions',
    'Mock Tests',
  ],
  authors: [{ name: 'Hritikpedia Editorial Team' }],
  creator: 'Hritikpedia',
  publisher: 'Hritikpedia Education Platform',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    title: 'Hritikpedia — Study Notes, PYQs & Mock Tests',
    description: BRAND.description,
    siteName: 'Hritikpedia',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hritikpedia — exam-ready study notes and tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hritikpedia — Study Notes, PYQs & Mock Tests',
    description: BRAND.description,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${baseUrl}/#organization`,
      name: BRAND.name,
      legalName: BRAND.legalName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
      },
      description: BRAND.description,
      sameAs: Object.values(BRAND.socials || {}),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: BRAND.supportEmail,
        availableLanguage: ['en', 'hi'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: BRAND.name,
      description: BRAND.description,
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${sourceSans.variable} scroll-smooth`}
    >
      <head>
        <ThemeScript />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased flex flex-col font-sans transition-colors duration-150">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
