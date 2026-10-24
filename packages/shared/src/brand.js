/**
 * HRITIKPEDIA BRAND IDENTITY TOKENS
 * Official Tagline: Stop Searching. Start Learning.
 */

export const BRAND = {
  name: 'Hritikpedia',
  legalName: 'Hritikpedia Education Platform',
  tagline: 'Stop Searching. Start Learning.',
  subTagline: 'Quality Study Notes. Smarter Preparation. Better Learning.',
  description:
    'Discover organized study notes, exam-focused resources, previous-year questions, and carefully structured learning materials—all in one place.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  supportEmail: 'support@hritikpedia.com',
  colors: {
    midnightNavy: '#07172B',
    deepNavy: '#0B1D36',
    electricBlue: '#087BFF',
    brightBlue: '#1688FF',
    goldenAccent: '#FFB923',
    lightBackground: '#F5F8FC',
    white: '#FFFFFF',
    bodyText: '#26354B',
    mutedText: '#64748B',
    borderLight: '#E2E8F0',
    borderDark: '#1E293B',
    cardLight: '#FFFFFF',
    cardDark: '#0B1D36',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  socials: {
    youtube: 'https://youtube.com/@hritikpedia',
    telegram: 'https://t.me/hritikpedia',
    linkedin: 'https://linkedin.com/company/hritikpedia',
    twitter: 'https://x.com/hritikpedia',
  },
};

export default BRAND;
