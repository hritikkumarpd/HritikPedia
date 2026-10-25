'use client';

import React, { useState, useMemo } from 'react';
import NoteCard from '../../components/NoteCard';
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Layers,
  Globe,
  Landmark,
  School,
  Cpu,
  GraduationCap,
  Languages,
  CheckCircle2,
  X,
  Tag,
} from 'lucide-react';
import { PAN_INDIA_DOMAINS } from '@hritikpedia/shared/data';

const DOMAIN_ICONS = {
  all: Globe,
  general_competitions: Landmark,
  school_boards: School,
  engineering: Cpu,
  general_degree: GraduationCap,
};

export default function NotesCatalogClient({
  initialNotes,
  subjects,
  initialDomain = 'all',
  initialMedium = 'all',
  initialTarget = 'all',
}) {
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [selectedMedium, setSelectedMedium] = useState(initialMedium);
  const [selectedTarget, setSelectedTarget] = useState(initialTarget);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'free' | 'under49' | 'paid'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_low' | 'price_high' | 'pages'

  // Extract all unique target exams/boards available
  const availableTargets = useMemo(() => {
    const set = new Set();
    initialNotes.forEach((n) => {
      if (n.targetExamOrBoard) {
        if (selectedDomain === 'all' || n.domain === selectedDomain) {
          set.add(n.targetExamOrBoard);
        }
      }
    });
    return Array.from(set).sort();
  }, [initialNotes, selectedDomain]);

  // Filtered subjects based on domain
  const availableSubjects = useMemo(() => {
    if (selectedDomain === 'all') return subjects;
    return subjects.filter((s) => s.domain === selectedDomain);
  }, [subjects, selectedDomain]);

  // Domain Counts
  const domainCounts = useMemo(() => {
    const counts = { all: initialNotes.length };
    PAN_INDIA_DOMAINS.forEach((d) => {
      if (d.id !== 'all') {
        counts[d.id] = initialNotes.filter((n) => n.domain === d.id).length;
      }
    });
    return counts;
  }, [initialNotes]);

  // Main Filtering Logic
  const filteredNotes = useMemo(() => {
    return initialNotes
      .filter((note) => {
        // Domain filter
        if (selectedDomain !== 'all' && note.domain !== selectedDomain) {
          return false;
        }

        // Target exam/board filter
        if (selectedTarget !== 'all' && note.targetExamOrBoard !== selectedTarget) {
          return false;
        }

        // Medium filter
        if (selectedMedium !== 'all' && note.medium !== selectedMedium) {
          return false;
        }

        // Subject filter
        if (
          selectedSubject !== 'all' &&
          note.subjectSlug !== selectedSubject &&
          String(note.subjectId) !== selectedSubject
        ) {
          return false;
        }

        // Price filter
        if (priceFilter === 'free' && (!note.isFree && note.price > 0)) return false;
        if (priceFilter === 'under49' && (note.price > 49)) return false;
        if (priceFilter === 'paid' && (note.isFree || note.price === 0)) return false;

        // Keyword Search
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            note.title.toLowerCase().includes(q) ||
            note.description.toLowerCase().includes(q) ||
            (note.topic && note.topic.toLowerCase().includes(q)) ||
            (note.subjectName && note.subjectName.toLowerCase().includes(q)) ||
            (note.targetExamOrBoard && note.targetExamOrBoard.toLowerCase().includes(q)) ||
            (note.department && note.department.toLowerCase().includes(q)) ||
            (note.topicsCovered && note.topicsCovered.some((t) => t.toLowerCase().includes(q)));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'pages') return (b.pageCount || 0) - (a.pageCount || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    initialNotes,
    selectedDomain,
    selectedTarget,
    selectedMedium,
    selectedSubject,
    priceFilter,
    search,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedDomain('all');
    setSelectedMedium('all');
    setSelectedTarget('all');
    setSelectedSubject('all');
    setSearch('');
    setPriceFilter('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedDomain !== 'all' ||
    selectedMedium !== 'all' ||
    selectedTarget !== 'all' ||
    selectedSubject !== 'all' ||
    Boolean(search.trim()) ||
    priceFilter !== 'all';

  return (
    <div className="space-y-8">
      {/* 1. TOP PAN-INDIA DOMAIN TABS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {PAN_INDIA_DOMAINS.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id] || Globe;
            const isSelected = selectedDomain === domain.id;
            const count = domainCounts[domain.id] || 0;

            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain.id);
                  setSelectedTarget('all');
                  setSelectedSubject('all');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#087BFF] text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{domain.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ADVANCED FILTERS & SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Row 1: Search & Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, exam, chapter (e.g. UPSC GS-2, BSEB 12th, AKTU DBMS)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] focus:border-[#087BFF] text-[#26354B]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Exam / Board Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="all">Target: All Exams / Boards</option>
              {availableTargets.map((target) => (
                <option key={target} value={target}>
                  🎯 {target}
                </option>
              ))}
            </select>
          </div>

          {/* Medium Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="all">All Mediums</option>
              <option value="hindi">हिंदी माध्यम (Hindi)</option>
              <option value="english">English Medium</option>
              <option value="bilingual">Bilingual / Hinglish</option>
            </select>
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price Filter Pills, Sorting, and Active Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Price Filter Options */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'all'
                  ? 'bg-white text-[#07172B] shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'free'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              100% Free (₹0)
            </button>
            <button
              onClick={() => setPriceFilter('under49')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'under49'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              Under ₹49 Micro-Price
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'paid'
                  ? 'bg-[#FFB923] text-[#07172B] shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              Premium Notes
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="pages">Most Pages</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#07172B] font-black">{filteredNotes.length}</strong> study notes
            </span>
            {selectedDomain !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
                <Tag className="w-3 h-3" />
                {PAN_INDIA_DOMAINS.find((d) => d.id === selectedDomain)?.label}
              </span>
            )}
            {selectedMedium !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold">
                <Languages className="w-3 h-3" />
                {selectedMedium === 'hindi' ? 'हिंदी माध्यम' : selectedMedium === 'english' ? 'English' : 'Bilingual'}
              </span>
            )}
            {selectedTarget !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold">
                🎯 {selectedTarget}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#087BFF] hover:underline font-bold cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. NOTES GRID */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#07172B]">No study notes matched your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or selecting &quot;All Domains&quot; to see notes across UPSC, BPSC, BSEB, CBSE, and Engineering.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg transition-colors cursor-pointer"
          >
            Show All Notes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
