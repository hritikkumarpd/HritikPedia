'use client';

import React, { useMemo, useState } from 'react';
import NoteCard from '../../components/NoteCard';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  LayoutGrid,
  List,
  BookOpen,
} from 'lucide-react';

const TYPE_LABELS = {
  notes: 'Complete Notes',
  pyqs: 'PYQs & Solutions',
  revision: 'Revision Sheets',
};

const normalize = (value) => (value || '').toString().trim().toLowerCase();

export default function NotesCatalogClient({
  initialNotes = [],
  subjects = [],
  initialCategory = 'all',
}) {
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const tabs = useMemo(() => {
    const counts = { all: initialNotes.length, notes: 0, pyqs: 0, revision: 0 };
    initialNotes.forEach((note) => {
      if (counts[note.contentType] !== undefined) counts[note.contentType] += 1;
    });

    return [
      { id: 'all', label: 'All Resources', count: counts.all },
      { id: 'notes', label: 'Study Notes', count: counts.notes },
      { id: 'pyqs', label: 'Solved PYQs', count: counts.pyqs },
      { id: 'revision', label: 'Revision Sheets', count: counts.revision },
    ];
  }, [initialNotes]);

  const subjectFilters = useMemo(() => {
    const counts = new Map();

    initialNotes.forEach((note) => {
      const name = note.subjectName || 'General Studies';
      counts.set(name, (counts.get(name) || 0) + 1);
    });

    subjects.forEach((subject) => {
      if (subject?.name && !counts.has(subject.name)) counts.set(subject.name, 0);
    });

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 14);
  }, [initialNotes, subjects]);

  const languageFilters = useMemo(() => {
    const values = new Set();
    initialNotes.forEach((note) => {
      if (note.language) values.add(note.language);
    });
    return [...values].sort();
  }, [initialNotes]);

  const typeFilters = useMemo(() => {
    const values = new Set();
    initialNotes.forEach((note) => {
      if (note.contentType) values.add(note.contentType);
    });
    return [...values].sort((a, b) => (TYPE_LABELS[a] || a).localeCompare(TYPE_LABELS[b] || b));
  }, [initialNotes]);

  const priceRanges = [
    { id: 'all', label: 'All prices' },
    { id: 'free', label: '100% Free' },
    { id: 'under100', label: 'Under ₹100' },
    { id: '100-200', label: '₹100 – ₹200' },
    { id: '200-500', label: '₹200 – ₹500' },
    { id: 'above500', label: 'Above ₹500' },
  ];

  const toggle = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleSubject = toggle(setSelectedSubjects);
  const toggleType = toggle(setSelectedTypes);
  const toggleLanguage = toggle(setSelectedLanguages);

  const activeFilterCount =
    selectedSubjects.length +
    selectedTypes.length +
    selectedLanguages.length +
    (priceRange !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSelectedSubjects([]);
    setSelectedTypes([]);
    setSelectedLanguages([]);
    setPriceRange('all');
    setSearch('');
    setActiveTab('all');
  };

  const filteredNotes = useMemo(() => {
    const query = normalize(search);

    return initialNotes
      .filter((note) => {
        if (activeTab !== 'all' && note.contentType !== activeTab) return false;

        if (selectedSubjects.length > 0) {
          const subjectName = normalize(note.subjectName);
          if (!selectedSubjects.some((s) => subjectName === normalize(s))) return false;
        }

        if (selectedTypes.length > 0 && !selectedTypes.includes(note.contentType)) {
          return false;
        }

        if (selectedLanguages.length > 0) {
          const language = normalize(note.language);
          if (!selectedLanguages.some((lang) => normalize(lang) === language)) return false;
        }

        const price = Number(note.price) || 0;
        if (priceRange === 'free' && price !== 0) return false;
        if (priceRange === 'under100' && price >= 100) return false;
        if (priceRange === '100-200' && (price < 100 || price > 200)) return false;
        if (priceRange === '200-500' && (price < 200 || price > 500)) return false;
        if (priceRange === 'above500' && price <= 500) return false;

        if (query) {
          const haystack = [
            note.title,
            note.subjectName,
            note.description,
            note.topic,
            note.examCategory,
          ]
            .map(normalize)
            .join(' ');
          if (!haystack.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price_high') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (Boolean(b.isFeatured) !== Boolean(a.isFeatured)) return b.isFeatured ? 1 : -1;
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      });
  }, [
    initialNotes,
    activeTab,
    selectedSubjects,
    selectedTypes,
    selectedLanguages,
    priceRange,
    search,
    sortBy,
  ]);

  const activeChips = [
    ...selectedSubjects.map((value) => ({
      key: `subject-${value}`,
      label: value,
      clear: () => toggleSubject(value),
    })),
    ...selectedTypes.map((value) => ({
      key: `type-${value}`,
      label: TYPE_LABELS[value] || value,
      clear: () => toggleType(value),
    })),
    ...selectedLanguages.map((value) => ({
      key: `language-${value}`,
      label: value,
      clear: () => toggleLanguage(value),
    })),
    ...(priceRange !== 'all'
      ? [
          {
            key: `price-${priceRange}`,
            label: priceRanges.find((range) => range.id === priceRange)?.label || priceRange,
            clear: () => setPriceRange('all'),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs & Mobile Filter Trigger */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Mobile Filter Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen((open) => !open)}
            className="btn btn-secondary btn-sm lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          } lg:col-span-3 lg:sticky lg:top-24 space-y-4`}
        >
          <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Filter Library
              </h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto py-3">
              {/* Subject Filter */}
              <FilterSection title="Computer Science Subjects">
                {subjectFilters.length === 0 ? (
                  <p className="text-xs text-slate-400">No subjects listed.</p>
                ) : (
                  subjectFilters.map((subject) => (
                    <FilterCheck
                      key={subject.name}
                      checked={selectedSubjects.includes(subject.name)}
                      onChange={() => toggleSubject(subject.name)}
                      label={subject.name}
                      count={subject.count}
                    />
                  ))
                )}
              </FilterSection>

              {/* Price Filter */}
              <FilterSection title="Access & Price">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex cursor-pointer select-none items-center gap-2 rounded-md py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="price_filter"
                      checked={priceRange === range.id}
                      onChange={() => setPriceRange(range.id)}
                      className="h-3.5 w-3.5 accent-blue-600"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Content Type */}
              <FilterSection title="Material Type">
                {typeFilters.map((type) => (
                  <FilterCheck
                    key={type}
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    label={TYPE_LABELS[type] || type}
                  />
                ))}
              </FilterSection>

              {/* Language Filter */}
              {languageFilters.length > 0 && (
                <FilterSection title="Medium & Language">
                  {languageFilters.map((language) => (
                    <FilterCheck
                      key={language}
                      checked={selectedLanguages.includes(language)}
                      onChange={() => toggleLanguage(language)}
                      label={language}
                    />
                  ))}
                </FilterSection>
              )}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <section className="space-y-4 lg:col-span-9">
          {/* Top Search & Sort Controls Bar */}
          <div className="card p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by topic, subject or exam..."
                className="input-field pl-9 pr-8 text-xs h-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="text-slate-500">
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredNotes.length}</span> of {initialNotes.length} study packs
            </p>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>{chip.label}</span>
                    <X className="h-2.5 w-2.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes List or Grid */}
          {filteredNotes.length === 0 ? (
            <div className="card p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                No matching study notes found
              </h4>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Try a different search term or clear active filters to see all available study packs.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-primary btn-sm mt-4"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id || note.slug} note={note} variant="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id || note.slug} note={note} variant="grid" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterCheck({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer select-none items-center justify-between rounded-md py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
            checked
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
          }`}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </span>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span className="truncate">{label}</span>
      </span>
      {typeof count === 'number' && (
        <span className="ml-2 text-[10px] font-semibold text-slate-400">{count}</span>
      )}
    </label>
  );
}
