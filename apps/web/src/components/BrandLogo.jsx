'use client';

import React from 'react';
import Link from 'next/link';

export default function BrandLogo({
  variant = 'horizontal', // 'horizontal' | 'stacked' | 'icon-only'
  theme = 'light', // 'light' | 'dark'
  showTagline = true,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', tagline: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', tagline: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', tagline: 'text-xs' },
  }[size] || { icon: 'w-9 h-9', text: 'text-2xl', tagline: 'text-[11px]' };

  const logoIcon = (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1688FF"/>
            <stop offset="100%" stopColor="#087BFF"/>
          </linearGradient>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD058"/>
            <stop offset="100%" stopColor="#FFB923"/>
          </linearGradient>
        </defs>

        {/* Graduation Cap Top Diamond */}
        <polygon points="100,20 185,55 100,90 15,55" fill={isDark ? '#FFFFFF' : '#07172B'}/>
        {/* Cap Base */}
        <path d="M45,68 L45,95 C45,115 155,115 155,95 L155,68 Z" fill={isDark ? '#E2E8F0' : '#0B1D36'}/>
        {/* Tassel */}
        <path d="M100,55 C120,55 135,70 142,85 L145,115" stroke="url(#logoGoldGrad)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <polygon points="140,115 150,115 147,135 143,135" fill="url(#logoGoldGrad)"/>

        {/* Open Book Base */}
        <path d="M100,105 C75,100 25,110 5,145 C35,145 75,142 100,158 C125,142 165,145 195,145 C175,110 125,100 100,105 Z" fill="#087BFF"/>

        {/* Open Book White Pages */}
        <path d="M100,108 C78,103 35,112 18,140 C42,139 78,138 100,152 C122,138 158,139 182,140 C165,112 122,103 100,108 Z" fill="#FFFFFF" stroke={isDark ? '#087BFF' : '#07172B'} strokeWidth="4"/>
        <path d="M100,112 L100,150" stroke={isDark ? '#087BFF' : '#07172B'} strokeWidth="4" strokeLinecap="round"/>

        {/* Lines on Left Page */}
        <path d="M38,122 C55,120 75,123 88,128" stroke="#087BFF" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40,132 C56,130 76,133 88,138" stroke="#087BFF" strokeWidth="3" strokeLinecap="round"/>

        {/* Lines on Right Page */}
        <path d="M112,128 C125,123 145,120 162,122" stroke="#087BFF" strokeWidth="3" strokeLinecap="round"/>
        <path d="M112,138 C124,133 144,130 160,132" stroke="#087BFF" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Hritikpedia Home">
        {logoIcon}
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link href="/" className={`inline-flex flex-col items-center group ${className}`} aria-label="Hritikpedia Home">
        {logoIcon}
        <div className="flex items-center tracking-tight font-black mt-1">
          <span className={`${sizeClasses.text} ${isDark ? 'text-white' : 'text-[#07172B]'}`}>HRITIK</span>
          <span className={`${sizeClasses.text} text-[#087BFF]`}>PEDIA</span>
        </div>
        {showTagline && (
          <span className={`${sizeClasses.tagline} font-semibold tracking-wide ${isDark ? 'text-slate-300' : 'text-[#26354B]'}`}>
            Stop Searching. Start Learning<span className="text-[#087BFF]">.</span>
          </span>
        )}
      </Link>
    );
  }

  // Default: Horizontal
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="Hritikpedia Home">
      {logoIcon}
      <div className="flex flex-col">
        <div className="flex items-center leading-none font-black tracking-tight">
          <span className={`${sizeClasses.text} ${isDark ? 'text-white' : 'text-[#07172B]'} transition-colors group-hover:opacity-95`}>
            HRITIK
          </span>
          <span className={`${sizeClasses.text} text-[#087BFF] transition-colors group-hover:text-[#1688FF]`}>
            PEDIA
          </span>
        </div>
        {showTagline && (
          <span className={`${sizeClasses.tagline} font-semibold tracking-tight mt-0.5 ${isDark ? 'text-slate-300' : 'text-[#26354B]'}`}>
            Stop Searching. Start Learning<span className="text-[#087BFF]">.</span>
          </span>
        )}
      </div>
    </Link>
  );
}
