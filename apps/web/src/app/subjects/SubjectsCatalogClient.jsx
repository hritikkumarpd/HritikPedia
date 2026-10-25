'use client';

import React, { useState, useMemo } from 'react';
import SubjectCard from '../../components/SubjectCard';
import {
  Globe,
  Landmark,
  School,
  Cpu,
  GraduationCap,
  Search,
  Layers,
  X,
} from 'lucide-react';
import { PAN_INDIA_DOMAINS } from '@hritikpedia/shared/data';

const DOMAIN_ICONS = {
  all: Globe,
  general_competitions: Landmark,
  school_boards: School,
  engineering: Cpu,
  general_degree: GraduationCap,
};

export default function SubjectsCatalogClient({ initialSubjects, initialDomain = 'all' }) {
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
          sub.description.toLowerCase().includes(q) ||
          sub.code.toLowerCase().includes(q) ||
          (sub.targetExamOrBoard && sub.targetExamOrBoard.toLowerCase().includes(q)) ||
          (sub.department && sub.department.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [initialSubjects, selectedDomain, search]);

  return (
    <div className="space-y-6">
      {/* Domain Navigation Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {PAN_INDIA_DOMAINS.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id] || Globe;
            const isSelected = selectedDomain === domain.id;
            const count = domainCounts[domain.id] || 0;

            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
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

      {/* Search & Results Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects (e.g. Polity, Physics, DBMS, Electrical)..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between sm:justify-end gap-3">
          <span>
            Showing <strong className="text-[#07172B] font-bold">{filteredSubjects.length}</strong> subjects
          </span>
          {(selectedDomain !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSearch('');
              }}
              className="text-[#087BFF] hover:underline font-bold cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#07172B]">No subjects found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search or selecting &quot;All Domains&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
