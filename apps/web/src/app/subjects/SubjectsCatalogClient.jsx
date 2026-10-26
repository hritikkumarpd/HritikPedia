'use client';

import React, { useState, useMemo } from 'react';
import SubjectCard from '../../components/SubjectCard';
import { Search, X, RotateCcw, BookOpen } from 'lucide-react';
import { PAN_INDIA_DOMAINS } from '@hritikpedia/shared/data';

export default function SubjectsCatalogClient({ initialSubjects = [], initialDomain = 'all' }) {
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [search, setSearch] = useState('');

  const domainCounts = useMemo(() => {
    const counts = { all: initialSubjects.length };
    PAN_INDIA_DOMAINS.forEach((d) => {
      if (d.id !== 'all') {
        counts[d.id] = initialSubjects.filter((s) => s.domain === d.id).length;
      }
    });
    return counts;
  }, [initialSubjects]);

  const filteredSubjects = useMemo(() => {
    return initialSubjects.filter((sub) => {
      if (selectedDomain !== 'all' && sub.domain !== selectedDomain) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches =
          sub.name.toLowerCase().includes(q) ||
          (sub.description || '').toLowerCase().includes(q) ||
          (sub.code || '').toLowerCase().includes(q) ||
          (sub.targetExamOrBoard && sub.targetExamOrBoard.toLowerCase().includes(q)) ||
          (sub.department && sub.department.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [initialSubjects, selectedDomain, search]);

  const reset = () => {
    setSelectedDomain('all');
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-3">
        {PAN_INDIA_DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          const count = domainCounts[domain.id] || 0;

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => setSelectedDomain(domain.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{domain.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Results Status Row */}
      <div className="card p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects: DBMS, Operating Systems, Networks..."
            aria-label="Search subjects"
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

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs text-slate-500">
          <span>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredSubjects.length}</span> of {initialSubjects.length} subjects
          </span>
          {(selectedDomain !== 'all' || search) && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            No subjects match that search
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Try a different keyword or reset to browse all computer science departments.
          </p>
          <button type="button" onClick={reset} className="btn btn-primary btn-sm mt-4">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
