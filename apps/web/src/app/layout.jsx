import './globals.css';
import { BRAND } from '@hritikpedia/shared/brand';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Hritikpedia — Stop Searching. Start Learning.',
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
    url: BRAND.url,
    title: 'Hritikpedia — Stop Searching. Start Learning.',
    description: BRAND.description,
    siteName: 'Hritikpedia',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hritikpedia - Quality Educational Notes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hritikpedia — Stop Searching. Start Learning.',
    description: BRAND.description,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F5F8FC] text-[#26354B] antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
