'use client';

import React, { useState, useMemo } from 'react';
import NoteCard from '../../components/NoteCard';
import { Search, Filter, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function NotesCatalogClient({ initialNotes, subjects }) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'free' | 'paid'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_low' | 'price_high' | 'pages'

  const filteredNotes = useMemo(() => {
    return initialNotes
      .filter((note) => {
        // Search filter
        const matchesSearch =
          !search ||
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.description.toLowerCase().includes(search.toLowerCase()) ||
          note.topic?.toLowerCase().includes(search.toLowerCase());

        // Subject filter
        const matchesSubject =
          selectedSubject === 'all' ||
          note.subjectSlug === selectedSubject ||
          String(note.subjectId) === selectedSubject;

        // Price filter
        const matchesPrice =
          priceFilter === 'all' ||
          (priceFilter === 'free' && (note.isFree || note.price === 0)) ||
          (priceFilter === 'paid' && !note.isFree && note.price > 0);

        return matchesSearch && matchesSubject && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'pages') return (b.pageCount || 0) - (a.pageCount || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialNotes, search, selectedSubject, priceFilter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword (e.g. Normalization, Semaphore, K-Map)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] focus:border-[#087BFF] text-[#26354B]"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="shrink-0 w-full md:w-56">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="shrink-0 flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'all'
                  ? 'bg-white text-[#07172B] shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'free'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              Free (₹0)
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                priceFilter === 'paid'
                  ? 'bg-[#FFB923] text-[#07172B] shadow-xs'
                  : 'text-slate-600 hover:text-[#07172B]'
              }`}
            >
              Premium
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="shrink-0 w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="pages">Most Pages</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-[#07172B]">{filteredNotes.length}</strong> study notes
          </span>

          {(search || selectedSubject !== 'all' || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedSubject('all');
                setPriceFilter('all');
              }}
              className="text-[#087BFF] hover:underline font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#07172B]">No study notes matched your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or resetting the subject and price filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSubject('all');
              setPriceFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg transition-colors"
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
