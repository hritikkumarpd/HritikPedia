import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NoteCard from '../../components/NoteCard';
import PageHero from '../../components/PageHero';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { getCatalogNotes } from '../../lib/catalog';
import { Sparkles, BookOpen, ShieldCheck, ArrowRight, FileText, Eye, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: '100% Free Computer Science Study Notes & Handbooks | Hritikpedia',
  description:
    'Access 100% free computer science study notes, revision cheat-sheets, syllabus blueprints, and worked solutions on Hritikpedia.',
  alternates: {
    canonical: '/free-resources',
  },
  openGraph: {
    title: '100% Free Computer Science Study Notes & Handbooks | Hritikpedia',
    description:
      'Access 100% free computer science study notes, revision cheat-sheets, syllabus blueprints, and worked solutions on Hritikpedia.',
    url: '/free-resources',
    type: 'website',
  },
};

export const revalidate = 300;

export default async function FreeResourcesPage() {
  const notes = await getCatalogNotes();
  const freeNotes = notes.filter((n) => n.isFree || Number(n.price) === 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Open Access Library"
          title="Free Study Notes, PYQs &amp; Revision Handbooks"
          description="Complete free chapter notes, formula cheat sheets, circuit diagrams and syllabus blueprints. Read them online in the interactive reader — start to finish without paywalls."
          breadcrumbs={[{ label: 'Free resources' }]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    Genuinely 100% Free
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Full reading access in your browser. No payment card, no trial period, no truncated chapters.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <span className="font-display text-2xl font-black text-slate-900 dark:text-white">
                    {freeNotes.length}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Free Packs Available
                  </span>
                </div>
                <div>
                  <span className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹0
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Free Forever
                  </span>
                </div>
              </div>
            </div>
          }
        />

        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot slotId="home_top" />

            <div className="mt-6">
              <SectionHeading
                eyebrow="Open Access Catalog"
                title="Free Study Packs Ready to Read"
                description="Pick any topic and start studying immediately. Every free resource is a complete document, checked against the syllabus."
                action={{ label: 'Explore Paid Study Packs', href: '/notes' }}
              />

              {freeNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {freeNotes.map((note) => (
                    <NoteCard key={note.id || note.slug} note={note} />
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    New Free Packs Being Curated
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our team is currently publishing additional free revision cheat sheets. Browse our full library in the meantime.
                  </p>
                  <Link href="/notes" className="btn btn-primary btn-sm mt-4">
                    <span>Browse All Notes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quality Guarantees Grid */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: FileText,
                  title: 'Complete Uncut Documents',
                  copy: 'Every free pack is a complete syllabus document — never truncated mid-chapter.',
                },
                {
                  icon: Eye,
                  title: 'Built-in Web Reader',
                  copy: 'Read distraction-free on desktop or mobile. Fully formatted with dark mode.',
                },
                {
                  icon: Sparkles,
                  title: 'Editorial Peer Reviewed',
                  copy: 'Mapped to official examination criteria and checked by CSE educators before release.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
