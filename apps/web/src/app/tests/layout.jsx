export const metadata = {
  title: 'Evaluative Mock Tests & Exam Simulators — Bihar STET & BPSC CSE',
  description:
    'Practice with timed Computer Science mock test series for Bihar STET, BPSC Teacher, and engineering university exams. Instant score analytics, question breakdown, and verified answer keys.',
  keywords: [
    'Computer Science Mock Test',
    'Bihar STET Mock Test 2026',
    'BPSC Computer Teacher Test Series',
    'Digital Logic Mock Exam',
    'DBMS Practice Paper',
    'Free Engineering Test Simulator',
  ],
  alternates: {
    canonical: '/tests',
  },
  openGraph: {
    title: 'Evaluative Mock Tests & Exam Simulators | Hritikpedia',
    description:
      'Timed Computer Science exam simulations with instant score breakdown and verified answer explanations.',
    url: '/tests',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hritikpedia Evaluative Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evaluative Mock Tests & Exam Simulators | Hritikpedia',
    description:
      'Timed Computer Science exam simulations with instant score breakdown and verified answer explanations.',
    images: ['/logo.png'],
  },
};

export default function TestsLayout({ children }) {
  return children;
}
