'use client';

import React from 'react';
import Link from 'next/link';

export default function BrandLogo({
  variant = 'horizontal',
  theme = 'light',
  showBadge = true,
  className = '',
  size = 'md',
}) {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', badge: 'text-xs' },
  }[size] || { icon: 'w-8 h-8', text: 'text-xl', badge: 'text-[10px]' };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="Hritikpedia Admin Console">
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="adminLogoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1688FF"/>
              <stop offset="100%" stopColor="#087BFF"/>
            </linearGradient>
            <linearGradient id="adminLogoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD058"/>
              <stop offset="100%" stopColor="#FFB923"/>
            </linearGradient>
          </defs>

          {/* Graduation Cap */}
          <polygon points="100,20 185,55 100,90 15,55" fill={isDark ? '#FFFFFF' : '#07172B'}/>
          <path d="M45,68 L45,95 C45,115 155,115 155,95 L155,68 Z" fill={isDark ? '#E2E8F0' : '#0B1D36'}/>
          <path d="M100,55 C120,55 135,70 142,85 L145,115" stroke="url(#adminLogoGoldGrad)" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <polygon points="140,115 150,115 147,135 143,135" fill="url(#adminLogoGoldGrad)"/>

          {/* Book */}
          <path d="M100,105 C75,100 25,110 5,145 C35,145 75,142 100,158 C125,142 165,145 195,145 C175,110 125,100 100,105 Z" fill="#087BFF"/>
          <path d="M100,108 C78,103 35,112 18,140 C42,139 78,138 100,152 C122,138 158,139 182,140 C165,112 122,103 100,108 Z" fill="#FFFFFF" stroke={isDark ? '#087BFF' : '#07172B'} strokeWidth="4"/>
          <path d="M100,112 L100,150" stroke={isDark ? '#087BFF' : '#07172B'} strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${sizeClasses.text} ${isDark ? 'text-white' : 'text-[#07172B]'}`}>
            HRITIK<span className="text-[#087BFF]">PEDIA</span>
          </span>
          {showBadge && (
            <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#07172B] text-[#FFB923] border border-[#FFB923]/30 ${sizeClasses.badge}`}>
              ADMIN
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
          Management &amp; Security Portal
        </span>
      </div>
    </Link>
  );
}
