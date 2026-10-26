import './globals.css';
import { Nunito, Source_Sans_3 } from 'next/font/google';
import AdminShell from '../components/AdminShell';
import { ThemeProvider, ThemeScript } from '../components/ThemeProvider';

const display = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const sans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const metadata = {
  title: 'HritikPedia Operations Console',
  description: 'Enterprise Management, Content Governance, and Security Console for HritikPedia',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        <ThemeScript />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <ThemeProvider>
          <AdminShell>{children}</AdminShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
