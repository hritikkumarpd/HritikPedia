import './globals.css';
import AdminShell from '../components/AdminShell';

export const metadata = {
  title: 'Hritikpedia Admin Console',
  description: 'Management, Content, and Security Console for Hritikpedia',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased font-sans">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
